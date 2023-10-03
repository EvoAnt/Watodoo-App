const Event = require("../models/Event");

const isOwner = (req, res, next) => {
  Event.findById(req.params.eventId)
    .populate("owner")
    .then((foundEvent) => {
      console.log("Found event ===>", foundEvent);
      console.log("User in session ===>", req.session.user);
      if (foundEvent.owner._id.toString() === req.session.user._id) {
        console.log("Match");
        next();
      } else {
        res.redirect("/events/all-events");
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = isOwner;
