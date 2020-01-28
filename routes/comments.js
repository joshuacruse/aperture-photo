var express = require("express");
var router = express.Router();
var photos = require("../models/comment")
var Photo = require("../models/photo");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// comments routes

// new comment route
router.get("/photos/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // find photo by id
    Photo.findById(req.params.id, function (err, photo) {
      if (err) {
        req.flash("error", "Error. Comment could not be added.");
        res.redirect("back");
      }
      else {
        res.render("comments/new", {photo: photo});
      }
    })
});

// create comment route
router.post("/photos/:id/comments", middleware.isLoggedIn, function(req,res) {
  // look up photo w/ id
  Photo.findById(req.params.id, function(err, photo) {
    if (err) {
      req.flash("error", "Photo not found.");
      res.redirect("back")
    }
    else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Error. The comment could not be added.");
          res.redirect("back");
        }
        else {
          // add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          photo.comments.push(comment);
          photo.save();
          req.flash("success", "Comment added.");
          res.redirect("/photos/" + photo._id);
        }
      });
    };
  });
});

// edit comment route
router.get("/photos/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      req.flash("error", "Error. The comment was not changed.");
      res.redirect("back");
    }
    else {
      res.render("comments/edit", {photo_id: req.params.id, comment: foundComment});
    }
  });
});

// update comment route
router.put("/photos/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    }
    else {
      res.redirect("/photos/" + req.params.id);
    }
  })
});

// destroy comment route
router.delete("/photos/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  // find by id and remove
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    }
    else {
      req.flash("success", "Comment removed.");
      res.redirect("/photos/" + req.params.id);
    }
  })
});

// login check function
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
