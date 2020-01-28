var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get('/', function(req, res) {
  res.render("landing");
});

// auth routes
// =============

// show register form
router.get("/register", function(req, res) {
  res.render("register");
});

// sign up logic
router.post("/register", function(req,res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message + ".");
      return res.redirect("/register");
    }
    req.flash("success", "You have signed up with the username " + req.body.username + ". Welcome to Aperture.");
    passport.authenticate("local")(req, res, function() {
      res.redirect("/photos");
    });
  });
});

// show login form
router.get("/login", function(req, res) {
  res.render("login");
});

// login logic route
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/photos",
    failureRedirect: "/login",
    failureFlash: "Login failed. The username and password combination is either incorrect or does not exist."
  }), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You have been logged out.")
  res.redirect("/photos");
});


module.exports = router;
