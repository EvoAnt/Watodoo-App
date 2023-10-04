const Post = require("../models/Post");

const isOwnerPost = (req, res, next) => {
  Post.findById(req.params.postId)
    .populate("owner")
    .then((foundPost) => {
      console.log("Found event ===>", foundPost);
      console.log("User in session ===>", req.session.user);
      if (foundPost.owner._id.toString() === req.session.user._id) {
        console.log("Match");
        next();
      } else {
        res.redirect("/community/all-posts");
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = isOwnerPost;