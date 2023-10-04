const Post = require("../models/Post");

const canEditPost = (req, res, next) => {
    Post.findById(req.params.postId)
      .populate("owner")
      .then((foundPost) => {
        console.log("Found post ===>", foundPost);
        console.log("User in session ===>", req.session.user);
        if (foundPost.owner._id.toString() === req.session.user._id) {
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

  module.exports = canEditPost;