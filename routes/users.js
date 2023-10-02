var express = require("express");
var router = express.Router();

const Event = require("../models/Event");

const { isLoggedIn } = require("../middleware/route-guard");

router.get("/profile", isLoggedIn, (req, res, next) => {
  Event.find({
    owner: req.session.user._id,
  })
    .then((events) => {
      console.log("Found events ==>", events);
      res.render("user/profile.hbs", { user: req.session.user, events: events });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get('/edit-profile/:userId', (req, res, next) => {
  
  res.render('user/edit-profile.hbs')
});

module.exports = router;
