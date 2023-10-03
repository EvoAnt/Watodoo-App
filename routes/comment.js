var express = require("express");
var router = express.Router();

const Comment = require("../models/Comment");
const Event = require("../models/Event");

const { isLoggedIn } = require("../middleware/route-guard");

const isOwner = require("../middleware/isOwner");

router.post("/new/:eventId", isLoggedIn, (req, res, next) => {
  Comment.create({
    user: req.session.user._id,
    comment: req.body.comment,
  })
    .then((newComment) => {
      return Event.findByIdAndUpdate(
        req.params.eventId,
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );
    })
    .then((eventAfterComment) => {
      console.log("Event after comment ===>", eventAfterComment);
      res.redirect(`/events/event-details/${eventAfterComment._id}`);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/delete/:commentId", isLoggedIn, (req, res, next) => {
  Comment.findByIdAndRemove(req.params.commentId)
    .then((deletedComment) => {
      console.log("Deleted comment ==>", deletedComment);
      res.redirect("/events/all-events");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
