const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');





//campground index or homepage
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
//campground form to create new campground
router.get('/new', isLoggedIn, (req, res) => {


    res.render('campgrounds/new');
})
//will create new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    //const campground = new Campground({...req.body.campground});;works too 
    await campground.save();
    req.flash('sakses', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`); 
}));
//show specific campground
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;//req.params.id
    // const campground = await Campground.findById(id).populate('reviews').populate('author');

    const campground = await Campground.findById(id)
    .populate({  
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    // console.log(campground);
    if (!campground) {
        
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))
//edit form for updating campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find and edit that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))
//updating the campground (saving in database)
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
    //const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});works too
    // const campground = await Campground.findByIdAndUpdate(id, req.body.campground);

    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('sakses', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`);

}))
//deleting specific campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('sakses', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
}))

module.exports = router;