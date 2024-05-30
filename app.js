const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const bodyParser = require('body-parser'); // Parse request bodies
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const cookieParser = require('cookie-parser'); // Parse cookies
const methodOverride = require('method-override');

const port = process.env.PORT || 3000; // Set server port
const app = express(); // Initialize Express application
app.use(express.static('public')); // Serve static files from 'public' directory
// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(methodOverride('_method')); // Handles method override for PUT/DELETE
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.use(cookieParser()); // Parse cookies
app.use(cors({ origin: '*' })); // Enable CORS for all origins

const ejs = require("ejs"); // Templating engine

app.set("view engine", "ejs"); // Set EJS as the view engine


// Import route modules
const users = require('./routes/User.routes');
const courses = require('./routes/Course.routes');
const sessions = require('./routes/Session.routes');
const contacts = require('./routes/Contact.routes');
const comments = require('./routes/Comment.routes');
const enrollments = require('./routes/Enrollment.routes');
const videos = require('./routes/Video.routes');
const my_courses = require('./routes/me.routes')

// Define route handlers for different pages

app.get('/',(req,res)=>{
    res.render('home.ejs');// Render home page
})

app.get('/course/course', (req, res) => {
    res.render('course.ejs'); // Render course page
});

app.get('/enrollments/enroll', (req, res) => {
    res.render('enrollment.ejs'); // Render course page
});

app.get('/courses/addCourse',(req,res)=>{
    res.render('hoverform.ejs');// Render hoverform page
})

app.get('/users/register', (req, res) => {
    res.render('register.ejs'); // Render registration page
});

app.get('/contacts/contact', (req, res) => {
    res.render('contact.ejs'); // Render contact page
});

app.get("/users/login", async (req, res) => {
    res.render("login.ejs"); // Render login page 
});

app.get('/videos/video',async(req,res)=>{
    res.render('video.ejs');// Render video page
})

// Mount route handlers for API endpoints
app.use('/users', users);
app.use('/courses', courses);
app.use('/sessions', sessions);
app.use('/contacts', contacts);
app.use('/comments', comments);
app.use('/enrollments', enrollments);
app.use('/videos', videos); 
app.use('/myCourses',my_courses)

// Start server and listen on specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
