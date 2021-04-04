const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport'); 
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {  
    useNewUrlParser: true, 
    useCreateIndex:true, 
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('Database connected');
})


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs'  );
app.set('views', path.join(__dirname, 'views'));
 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public'))); 
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));//must be before passport.session
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //must be declared after session() config
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
   // console.log(req.session);
    // if(!['/login', '/'].includes(req.originalUrl)){ nexttime
    //     req.session.returnTo = req.originalUrl;
    // }

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('sakses');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'coltttt@gmail.com', username: 'colttt'});
    const newUser = await User.register(user, 'chicken');
    res.send(newUser); 
})




//middleware validator
const validateCampground = (req,res,next)=>{ 
    const { error } = campgroundSchema.validate(req.body);  
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400) 
    } else {
        next();
    }   
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400) 
    } else {
        next();
    }
}

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


//home
app.get('/', (req, res) => {
    res.render('home'); 
})
//campground index or homepage
// app.get('/campgrounds', catchAsync (async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', {campgrounds});
// }))
// //campground form to create new campground
// app.get('/campgrounds/new', (req, res) => {

//     res.render('campgrounds/new');
// })
// //will create new campground
// app.post('/campgrounds', validateCampground, catchAsync (async (req, res) =>{
//     // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
//     const campground = new Campground(req.body.campground);
//     //const campground = new Campground({...req.body.campground});;works too 
//     await campground.save();    
//     res.redirect(`/campgrounds/${campground._id}`);
// }));
// //show specific campground
// app.get('/campgrounds/:id', catchAsync (async (req, res) => {
//     const { id } = req.params;//req.params.id
//     const campground = await Campground.findById(id).populate('reviews');
//     // console.log(campground);
//     res.render('campgrounds/show', {campground});
// }))
// //edit form for updating campground
// app.get('/campgrounds/:id/edit', catchAsync (async (req, res) => {
//     const id = req.params.id;
//     const campground = await Campground.findById(id);
//     res.render('campgrounds/edit', {campground}) ;
// }))
// //updating the campground (saving in database)
// app.put('/campgrounds/:id', validateCampground, catchAsync (async (req, res) => {
//     const id = req.params.id;
//     //const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});works too
//     const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
//     res.redirect(`/campgrounds/${campground._id}`);
    
// }))
// //deleting specific campground
// app.delete('/campgrounds/:id', catchAsync (async (req, res) => {
//     const id = req.params.id;
//     const campground = await Campground.findByIdAndDelete(id);
//     res.redirect(`/campgrounds`); 
// }))

//saving new reviews or rating in specific campground
// app.post('/campgrounds/:id/reviews', validateReview, catchAsync (async (req, res) => {
    
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review); 
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
// }))

// //deleting specific review or rating of specific campground
// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync (async (req, res) => {
    
//     const {id, reviewId} = req.params;

//     await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}, {useFindAndModify: false});
//     await Review.findByIdAndDelete(reviewId, {useFindAndModify: false});
//     res.redirect(`/campgrounds/${id}`);
    
// }))

// app.get('/makecampground', async (req, res) => { //not needed
//     // res.render('home');  
//     const camp = new Campground({
//         title: 'My Backyard',
//         descript: 'cheap camping',
//     })
//     await camp.save();
//     res.send(camp);
// })

app.all('*', (req, res, next) => {
    // res.send("404!!!!");
    next(new ExpressError('Page Not Found', 404)); 
})

app.use((err, req, res, next) => {

    const {statusCode = 500} = err;

if(!err.message) err.message = 'Oh No, Something Went Wrong!'

    res.status(statusCode).render('error', {err});
    // res.send('Oh boy, something went wrong!');
})


app.listen(3000, ()=> {
    console.log('running in port 3000!');
});