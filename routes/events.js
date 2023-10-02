var express = require("express");
var router = express.Router();

const Event = require("../models/Event");

const { isLoggedIn } = require("../middleware/route-guard"); 

router.get("/all-events", (req, res, next) => {
  Event.find()
    .populate("owner")
    .then((events) => {
      console.log("Found events ===>", events);
      res.render("events/all-events.hbs", { events });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get('/new', isLoggedIn, (req, res, next) => {
    res.render('events/add-event.hbs')
});

router.post("/new", isLoggedIn, (req, res, next) => {
    const { name, location, description, imageUrl } = req.body;
  
    Event.create({
      name,
      location,
      description,
      imageUrl,
      owner: req.session.user._id,
    })
      .then((createdEvent) => {
        console.log("New Event ===>", createdEvent);
        res.redirect("/events/all-events");
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });

module.exports = router;
