var express = require("express");
var router = express.Router();

const Event = require("../models/Event");

const { isLoggedIn } = require("../middleware/route-guard");
const User = require("../models/User");

router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log("reqsession ", req.session);
  User.findById(req.session.user._id).then((user) => {
    Event.find({owner: user._id})
    .then((events) => {
      res.render("user/profile.hbs", {user, events});
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

router.post("/profile/savedEvents", (req, res, next) => {
  Event.findById(req.params.savedEvents)
  
})

module.exports = router;
