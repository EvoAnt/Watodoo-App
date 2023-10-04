var express = require("express");
var router = express.Router();

const Event = require("../models/Event");
const Post = require("../models/Post");

const { isLoggedIn } = require("../middleware/route-guard");
const User = require("../models/User");

router.get("/profile", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user._id)
  .populate('savedEvents')
    .then((user) => {
      Post.find({ owner: user._id })
        .then((posts) => {
          Event.find({ owner: user._id }).then((events) => {
            res.render("user/profile.hbs", { user, posts, events });
          });
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
      console.log("Found user ===>", user);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/edit-profile/:userId", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user._id)
    .then((user) => {
      console.log("Found user ===>", user);
      res.render("user/edit-profile.hbs", user);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post("/edit-profile/:userId", isLoggedIn, (req, res, next) => {
  User.findByIdAndUpdate(req.session.user._id, req.body, { new: true })
    .then((updatedProfile) => {
      console.log("Profile after update", updatedProfile);
      res.redirect(`/users/profile`);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post("/profile/save-event/:eventId", isLoggedIn, (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.session.user._id;

  User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedEvents: eventId } },
    { new: true }
  )
    .then((user) => {
      console.log("User after saving event:", user);
      res.redirect("/users/profile");
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
