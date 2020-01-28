var express = require("express");
var router = express.Router();
var Photo = require("../models/photo");
var middleware = require("../middleware");

// show all photos
router.get("/photos", function(req, res) {
  Photo.find({}, function(err, photos) {
    if(err){
      console.log(err);
    }
    else {
      res.render("photos/index", {photos:photos});
    }
  })
});

// create new photo
router.post("/photos", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newPhoto = {name: name, image: image, description: desc, author: author};
  // create photo and save to database
  Photo.create(newPhoto, function(err, newlyCreated){
    if(err) {
      req.flash("error", "Internal Error. The photo could not be created.");
      console.log(err);
      res.redirect("back");
    }
    else {
      // redirect to photos page
      req.flash("success", "The photo was successfully added to Aperture.");
      res.redirect("/photos");
    };
  });
});

// new photo
router.get("/photos/new", middleware.isLoggedIn, function(req, res) {
  res.render("photos/new");
});

// show info about one photo
router.get("/photos/:id", function(req, res) {
  // find photo with id
  Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto) {
    if(err || !foundPhoto) {
      req.flash("error", "Photo not found.");
      res.redirect("/photos/")
    }
    else {
      // render show template with photo
      res.render("photos/show", {photo: foundPhoto});
    };
  });
});

// edit photo route
router.get("/photos/:id/edit", middleware.checkPhotoOwnership, function(req, res) {
  Photo.findById(req.params.id, function(err, foundPhoto) {
    if (err) {

    }
      res.render("photos/edit", {photo: foundPhoto});
  });
});


// update photo route
router.put("/photos/:id", middleware.checkPhotoOwnership, function(req, res) {
  // find and update correct photo
  Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto) {
    if (err) {
      res.redirect("/photos");
    }
    else {
      res.redirect("/photos/" + req.params.id);
    }
  });
  // redirect to show page of photo
});

// destroy photo route
router.delete("/photos/:id", middleware.checkPhotoOwnership, function(req, res) {
  Photo.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      req.flash("error", "You do not have permission to do that.");
      console.log(err);
    }
    else {
      req.flash("success", "Photo removed.");
      res.redirect("/photos");
    };
  });
});


module.exports = router;
