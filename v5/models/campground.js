var mongoose = require("mongoose");

// DB Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }       
    ]
});

// Creates Model of above Schema
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;