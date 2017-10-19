var express = require("express");
var app = express();
var bodyParser = require("body-parser");

 var campgrounds = [
        {name: "Hoth", image: "https://farm6.staticflickr.com/5759/22400114579_f2c754cf6a_b.jpg"},
        {name: "Yavin", image: "https://cdn0.artstation.com/p/assets/images/images/001/316/540/large/saby-menyhei-yavindmp-final-widescreen-16bit.jpg?1444230829"},
        {name: "Dagobah", image: "https://i.ytimg.com/vi/FVj0uLRNuPk/maxresdefault.jpg"}
];

// Enables Return / Use of JSON
app.use(bodyParser.urlencoded({extended: true}));


// Set Views file locations / engine / file types
app.set("view engine", "ejs");


// ROUTES //

// Landing Page - GET
app.get("/", function(req, res) {
    res.render("landing");
})

// Campgrounds Main Page - GET - Landing Page - Show All Campgrounds
app.get("/campgrounds", function(req, res) {
   
    res.render("campgrounds", {campgrounds: campgrounds});
}) 

// Campgrounds Main Page - POST - Create New Campground
app.post("/campgrounds", function(req, res) {
   // get data input into form and add it to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var newCampground = {name: name, image: image}
   campgrounds.push(newCampground);
   // redirect back to Campgrounds - GET route page
   // ** Although we have 2 Campground routes - Redirect defaults to GET - request **
   res.redirect("/campgrounds");
    
});

// Campgrounds Main Page - GET - Data to Send to Above POST route
app.get("/campgrounds/new", function(req, res) {
   res.render("new");
});

// Server Start / Initialization
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has started !!!");
})