var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds")



// Dynamically creates and connects database - using MongoDB
// To store, generate and serve - dynamic content to users
mongoose.connect("mongodb://localhost/yelp_camp_v3");

// Enables Return / Use of JSON
app.use(bodyParser.urlencoded({extended: true}));

// Set Views file locations / engine / file types
app.set("view engine", "ejs");

// Seed the DB with data from models / schema
seedDB();


// ROUTES //

// Landing Page - GET
app.get("/", function(req, res) {
    res.render("landing");
})

// INDEX - Show All Campgrounds
// Campgrounds Main Page - GET - Landing Page - Show All Campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
             // redirect back to Campgrounds - GET route page
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
}); 

// CREATE - Add New Campground to DB
// Campgrounds Main Page - POST - Create New Campground
app.post("/campgrounds", function(req, res) {
   // get data input into form and add it to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var newCampground = {name: name, image: image, description: desc}
   // Create a new campground and save to DB
   Campground.create(newCampground, function(err, newlyCreated){
       if (err) {
           console.log(err);
       } else {
            // redirect back to Campgrounds - GET route page
            // ** Although we have 2 Campground routes - Redirect defaults to GET - request **
            res.redirect("/campgrounds");     
       }
   });
});

// New - Show Form To Create New Campground
// Campgrounds Main Page - GET - Data to Send to Above POST route
app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});

// SHOW - Displays additional info about a single, given campground
app.get("/campgrounds/:id", function(req, res) {
    // Finds campgroudn with provided ID in query string
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // Renders show template with info for appropriate campground
            console.log(foundCampground);
            res.render("show", {campground: foundCampground});     
        }
    });
})
// Server Start / Initialization
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has started !!!");
})