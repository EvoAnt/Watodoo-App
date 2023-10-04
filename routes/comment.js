var express = require("express");
var router = express.Router();

const Comment = require("../models/Comment");
const Post = require("../models/Post");

const { isLoggedIn } = require("../middleware/route-guard");

router.post("/new/:postId", isLoggedIn, (req, res, next) => {
  Comment.create({
    user: req.session.user._id,
    comment: req.body.comment,
  })
    .then((newComment) => {
      return Post.findByIdAndUpdate(
        req.params.postId,
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );
    })
    .then((postAfterComment) => {
      console.log("Post after comment ===>", postAfterComment);
      res.redirect(`/community/post-details/${postAfterComment._id}`);
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
      res.redirect("/community/all-posts");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
