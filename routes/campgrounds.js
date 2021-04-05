const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {
    index, 
    renderNewForm, 
    createCampground, 
    showCampground, 
    renderEditForm, 
    updateCampground,
    deleteCampground
} = require('../controllers/campgrounds');

const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage})

const Campground = require('../models/campground');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createCampground));


    // .post(upload.array('image'),(req, res) => {
    //     //console.log(req.body, req.file);
    //     console.log(req.body, req.files);
    //     res.send('it worked!')
    // })

router.get('/new', isLoggedIn, renderNewForm)

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground)) 

router.get('/:id/edit', 
    isLoggedIn, 
    isAuthor, 
    catchAsync(renderEditForm))

module.exports = router;