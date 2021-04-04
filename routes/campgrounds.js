const express = require('express');
const router = express.Router();
const {
    index, 
    renderNewForm, 
    createCampground, 
    showCampground, 
    renderEditForm, 
    updateCampground,
    deleteCampground
} = require('../controllers/campgrounds');

const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');





//campground index or homepage
router.get('/', catchAsync(index))
//campground form to create new campground 
router.get('/new', isLoggedIn, renderNewForm)
//will create new campground createCampground
router.post('/', isLoggedIn, validateCampground, catchAsync(createCampground));
//show specific campground
router.get('/:id', catchAsync(showCampground))
//edit form for updating campground
router.get('/:id/edit', 
isLoggedIn, 
isAuthor, 
catchAsync(renderEditForm))
//updating the campground (saving in database)
router.put('/:id', 
isLoggedIn, 
validateCampground, 
catchAsync(updateCampground))
//deleting specific campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCampground))

module.exports = router;