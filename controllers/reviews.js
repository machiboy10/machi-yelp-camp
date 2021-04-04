const Campground= require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review).populate('author'); 
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('sakses', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}} );
    await Review.findByIdAndDelete(reviewId);
    req.flash('sakses', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
    
}