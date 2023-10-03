var express = require("express");
var router = express.Router();

const Event = require("../models/Event");

const { isLoggedIn } = require("../middleware/route-guard");
const canEdit = require("../middleware/canEdit");
const isOwner = require("../middleware/isOwner");

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

router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("events/add-event.hbs");
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

router.get("/event-details/:eventId", isLoggedIn, canEdit, (req, res, next) => {
    Event.findById(req.params.eventId)
      .populate("owner")
      .populate({
        path: "comments",
        populate: { path: "user" },
      })
      .then((event) => {
        console.log("Found event ===>", event);

        let comments = event.comments.map((comment) => {
            if (comment.user._id.toString() === req.session.user._id) {
                return {...comment._doc, canDelete: true}
            } else {
                return comment
            }
        })
        console.log('comments after map', comments)
        res.render("events/event-details.hbs", {
          event,
          canEdit: req.session.user.canEdit,
          comments: comments,
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });

router.get("/edit/:eventId", isLoggedIn, isOwner, (req, res, next) => {
  Event.findById(req.params.eventId)
    .then((event) => {
      console.log("Found event ===>", event);
      res.render("events/edit-event.hbs", event);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post("/edit/:eventId", isLoggedIn, isOwner, (req, res, next) => {
  Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true })
    .then((updatedEvent) => {
      console.log("Event after update", updatedEvent);
      res.redirect(`/events/event-details/${updatedEvent._id}`);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/delete/:eventId", isLoggedIn, isOwner, (req, res, next) => {
  Event.findByIdAndRemove(req.params.eventId)
    .then((deletedEvent) => {
      console.log("Deleted event ==>", deletedEvent);
      res.redirect("/events/all-events");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
