Photo = require("../models/photo");
Comment = require("../models/comment");

// middleware goes here
var middlewareObj = {};

// check photo owner
middlewareObj.checkPhotoOwnership = function(req, res, next) {
  // is logged in?
  if (req.isAuthenticated()) {
    Photo.findById(req.params.id, function(err, foundPhoto) {
      if (err || !foundPhoto) {
        req.flash("error", "Photo not found.");
        console.redirect("back");
      }
      else {
        // photo belong to user?
        if (foundPhoto.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error", "You do not have permission to do that.");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("back");
  };
};

// check comment owner
middlewareObj.checkCommentOwnership = function(req, res, next) {
  // is logged in?
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Comment not found.");
        res.redirect("back");
      }
      else {
        // comment belong to user?
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        }
        else {
          req.flash("error", "You do not have permission to do that.");
          res.redirect("back");
        }
      }
    });
  }
  else {
    res.redirect("back");
  };
};

// login check function
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in to do that.");
  res.redirect("/login");
};

module.exports = middlewareObj;
