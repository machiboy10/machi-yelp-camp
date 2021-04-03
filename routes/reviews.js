const express = require('express');
const router = express.Router({mergeParams: true});//{mergeParams: true} use only when the params ex. :id is separated in the router path;
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');



//saving new reviews or rating in specific campground
router.post('/', isLoggedIn, validateReview, catchAsync (async (req, res) => {
    
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review).populate('author'); 
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('sakses', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

//deleting specific review or rating of specific campground
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync (async (req, res) => {
    
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}} );
    await Review.findByIdAndDelete(reviewId);
    req.flash('sakses', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
    
}))

module.exports = router;