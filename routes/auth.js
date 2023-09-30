var express = require("express");
var router = express.Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { fullName, email, password, userName } = req.body;

  if (!fullName || !email || !password || !userName) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "Fields are mandatory. Please provide your full name, username, email and password.",
    });
    return;
  }

  User.findOne({
    email,
  })
    .then((foundUser) => {
      if (!foundUser) {
        bcryptjs
          .genSalt(saltRounds)
          .then((salt) => bcryptjs.hash(password, salt))
          .then((hashedPassword) => {
            return User.create({
              fullName,
              email,
              password: hashedPassword,
              userName,
            });
          })
          .then((createdUser) => {
            console.log("Newly created user is: ", createdUser);
            req.session.user = createdUser;
            console.log("Session after signup ===>", req.session);
            res.redirect("/users/profile");
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      } else {
        res.render("auth/signup.hbs", {
          errorMessage: "Email or username already taken.",
        });
        return;
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("Email not registered. ");
        res.render("auth/login", {
          errorMessage: "User not found and/or incorrect password.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.user = user;
        console.log("Session after success ===>", req.session);

        res.redirect("/");
      } else {
        console.log("Incorrect password. ");
        res.render("auth/login.hbs", {
          errorMessage: "User not found and/or incorrect password.",
        });
      }
    })
    .catch((error) => next(error));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
