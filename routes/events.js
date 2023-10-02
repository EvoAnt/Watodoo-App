var express = require("express");
var router = express.Router();

const Event = require("../models/Event");

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

router.get('/new', (req, res, next) => {
    
})


module.exports = router;
