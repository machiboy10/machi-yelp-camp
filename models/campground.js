const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async (data) => {
    //console.log('delicked!');
   // console.log(data);sdf

    if(data) {
        await Review.deleteMany({   //remove is deprecated
                _id: {  $in: data.reviews  }
            }) 
    }
    
})

module.exports = mongoose.model('Campground', CampgroundSchema); 