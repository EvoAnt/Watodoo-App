const Event = require("../models/Event");

const canEdit = (req, res, next) => {
  Event.findById(req.params.eventId)
    .populate("owner")
    .then((foundEvent) => {
      console.log("Found event ===>", foundEvent);
      console.log("User in session ===>", req.session.user);
      if (foundEvent.owner._id.toString() === req.session.user._id) {
        console.log("Match");
        req.session.user.canEdit = true;
        console.log("User after edit check", req.session.user);
        next();
      } else {
        req.session.user.canEdit = false;
        console.log("User after edit check", req.session.user);
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = canEdit;
