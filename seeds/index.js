const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true, 
    useCreateIndex:true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected');
});


const sample = array =>  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    // const c = new Campground({title: 'purple field'});
    // await c.save();
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6060a554f84c4c4434d9da73',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,         
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro pariatur veritatis consectetur magni, obcaecati ab tenetur ipsa aspernatur sed voluptatem assumenda, necessitatibus architecto doloribus iure deleniti odit perspiciatis voluptates distinctio.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {                 
                  url: 'https://res.cloudinary.com/dq8uzihyh/image/upload/v1617645501/YelpCamp/tkr1emldsauv2ey4bz86.jpg',
                  filename: 'YelpCamp/tkr1emldsauv2ey4bz86'
                },
                {              
                  url: 'https://res.cloudinary.com/dq8uzihyh/image/upload/v1617645501/YelpCamp/lrohtkzrxw4ndxugdcpo.jpg',
                  filename: 'YelpCamp/lrohtkzrxw4ndxugdcpo'
                },
              ]
        })
        await camp.save();

    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})

