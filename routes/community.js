var express = require("express");
var router = express.Router();

const Post = require("../models/Post");

const { isLoggedIn } = require("../middleware/route-guard");
const canEditPost = require("../middleware/canEditPost");
const isOwnerPost = require("../middleware/isOwnerPost");

const fileUploader = require('../config/cloudinary.config');


router.get("/all-posts", (req, res, next) => {
  Post.find()
    .populate("owner")
    .then((posts) => {
      console.log("Found events ===>", posts);
      if (!posts.length) {
        res.render("community/no-posts.hbs");
      } else {
        res.render("community/all-posts.hbs", { posts });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("community/new-post.hbs");
});

router.post("/new", isLoggedIn, fileUploader.single('imageUrl'), (req, res, next) => {
  const { name, location, description } = req.body;

  let image
  if (req.file) {
    console.log("cloudinary return", req.file.path)
    image = req.file.path
  } else {
    image = ''
  }

  Post.create({
    name,
    location,
    description,
    imageUrl: image,
    owner: req.session.user._id,
  })
    .then((createdPost) => {
      console.log("New Post ===>", createdPost);
      res.redirect("/community/all-posts");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get(
  "/post-details/:postId",
  isLoggedIn,
  canEditPost,
  (req, res, next) => {
    Post.findById(req.params.postId)
      .populate("owner")
      .populate({
        path: "comments",
        populate: { path: "user" },
      })
      .then((post) => {
        console.log("Found post ===>", post);

        let comments = post.comments.map((comment) => {
          if (comment.user._id.toString() === req.session.user._id) {
            return { ...comment._doc, canDelete: true };
          } else {
            return comment;
          }
        });
        console.log("comments after map", comments);
        res.render("community/post-details.hbs", {
          post,
          canEditPost: req.session.user.canEdit,
          comments: comments,
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
);

router.get("/edit/:postId", isLoggedIn, isOwnerPost, (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      console.log("Found post ===>", post);
      res.render("community/edit-post.hbs", post);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post("/edit/:postId", isLoggedIn, isOwnerPost, (req, res, next) => {
  Post.findByIdAndUpdate(req.params.postId, req.body, { new: true })
    .then((updatedPost) => {
      console.log("Post after update", updatedPost);
      res.redirect(`/community/post-details/${updatedPost._id}`);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/delete/:postId", isLoggedIn, isOwnerPost, (req, res, next) => {
  Post.findByIdAndRemove(req.params.postId)
    .then((deletedPost) => {
      console.log("Deleted post ==>", deletedPost);
      res.redirect("/community/all-posts");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
