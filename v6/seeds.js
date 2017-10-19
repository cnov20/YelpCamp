var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    // These objects are the 'seeds'
    // These are passed into function below as 'seed'
    // To be created and added to DB
    {
        name: "Cloud's Rest",
        image: "https://www.fandompost.com/wp-content/uploads/2011/11/Star-Wars-Darth-Vader-Camping.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa",
        image: "https://www.fandompost.com/wp-content/uploads/2011/11/Star-Wars-Darth-Vader-Camping.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor",
        image: "https://www.fandompost.com/wp-content/uploads/2011/11/Star-Wars-Darth-Vader-Camping.jpg",
        description: "blah blah blah"
    }
];

function seedDB() {
    // Function - Removes all campgrounds
    Campground.remove({}, function(err) {
        if (err){
            console.log(err);
        }
         console.log("Removed campgrounds!");
            // Add campgrounds
          data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added a campground!");
                    // Create a comment
                    Comment.create(
                        {
                            text: "This place needs internet!!!",
                            author: "Homer Simpson"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment!");
                            }
                        });
                }       
            });
        });
    });
}

module.exports = seedDB;