var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash")
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Photo = require("./models/photo"),
    Comment = require("./models/comment"),
    User = require("./models/user");

// requiring routes
var commentRoutes = require("./routes/comments"),
    photoRoutes = require("./routes/photos"),
    indexRoutes = require("./routes/index")

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/post_photo");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
app.use(express.static('public'));

// passport configuration
app.use(require("express-session")({
  secret: "terraCat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use(photoRoutes);
app.use(commentRoutes);

app.listen('3000', function() {
  console.log('Server Online.')
});
