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
            author: '606940975b31d648245acf56',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro pariatur veritatis consectetur magni, obcaecati ab tenetur ipsa aspernatur sed voluptatem assumenda, necessitatibus architecto doloribus iure deleniti odit perspiciatis voluptates distinctio.',
            price
        })
        await camp.save();

    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})

