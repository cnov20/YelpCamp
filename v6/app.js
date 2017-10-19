var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds")



// Dynamically creates and connects database - using MongoDB
// To store, generate and serve - dynamic content to users
mongoose.connect("mongodb://localhost/yelp_camp_v3");

// Enables Return / Use of JSON
app.use(bodyParser.urlencoded({extended: true}));

// Enables / Connects - Our own FOLDER/DIRECTORY - with custom CSS (stylesheet(s))
app.use(express.static(__dirname + "/public"));

// Set Views file locations / engine / file types
app.set("view engine", "ejs");

// Seed the DB with data from models / schema
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session") ({
    secret: "Hogwarts School of Witchraft and Wizardry",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES //

// =========================
//    CAMPGROUNDS ROUTES
// =========================

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
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
   res.render("campgrounds/new");
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
            res.render("campgrounds/show", {campground: foundCampground});     
        }
    });
})


// =========================
//   COMMENTS ROUTES
// =========================

// New - Show Form To Create New Comment - Associated with Campground by ID
// Campgrounds Show Page - GET - Data to Send to Below POST route - to actually create new comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
         
    });
})

app.post("/campgrounds/:id/comments/", isLoggedIn, function(req, res) {
   
   // Find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    // Save in DB
                    campground.save();
                    // Redirect to Show Page - now displaying new comment
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
})

// ====================
// AUTHORIZATION ROUTES
// ====================

// Show/Render Registration Form
app.get("/register", function(req, res) {
    res.render("register");
})

// Handle Sign Up Logic
app.post("/register", function(req, res) {
   let newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user) {
       if (err) {
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function() {
           res.redirect("/campgrounds");
       });
   });
});

// Show/Render Login Form
app.get("/login", function(req, res) {
    res.render("login");
})

// Handle Login Logic - Passport MIDDLEWARE
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    
    }), function(req, res) {
});

// Log Out Route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

// MIDDLEWARE - Check Log In Status
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Server Start / Initialization
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has started !!!");
})