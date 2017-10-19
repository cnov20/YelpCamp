var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground")


// Dynamically creates and connects database - using MongoDB
// To store, generate and serve - dynamic content to users
mongoose.connect("mongodb://localhost/yelp_camp");


// Campground.create(
//     {
//         name: "Yavin", 
//         image: "https://cdn0.artstation.com/p/assets/images/images/001/316/540/large/saby-menyhei-yavindmp-final-widescreen-16bit.jpg?1444230829",
//         description: "The Rebel Base"
        
//     }, function(err, campground){
//         if(err) {
//             console.log(err);
//         }
//         console.log("Newly created campground");
//         console.log(campground);
//     });

// Enables Return / Use of JSON
app.use(bodyParser.urlencoded({extended: true}));

// Set Views file locations / engine / file types
app.set("view engine", "ejs");

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
   var newCampgro und = {name: name, image: image, description: desc}
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
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // Renders show template with info for appropriate campground
            res.render("show", {campground: foundCampground});     
        }
    });
})
// Server Start / Initialization
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has started !!!");
})