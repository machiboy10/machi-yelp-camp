const express = require('express');
const router = express.Router({mergeParams: true});//{mergeParams: true} use only when the params ex. :id is separated in the router path;
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews')
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');



//saving new reviews or rating in specific campground
router.post('/', isLoggedIn, validateReview, catchAsync (reviews.createReview))

//deleting specific review or rating of specific campground
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync (reviews.deleteReview))

module.exports = router;