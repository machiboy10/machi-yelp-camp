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

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, validateCampground, catchAsync(createCampground));

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