const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    const campground = new Campground(req.body.campground);

    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    //const campground = new Campground({...req.body.campground});;works too 
    await campground.save();
    console.log(campground)
    req.flash('sakses', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`); 
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find and edit that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
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

}

module.exports.deleteCampground = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('sakses', 'Successfully deleted campground!');
    res.redirect(`/campgrounds`);
}