var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  } else {
    res.render("index", { title: "Watodoo" });
  }
});

module.exports = router;
