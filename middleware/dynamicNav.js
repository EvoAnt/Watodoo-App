const dynamicNav = (req, res, next) => {
  console.log("*****HITTTING MIDDLEWARE******");
  if (req.session.user) {
    console.log("user in session");
    res.locals.isLoggedIn = true;
  } else {
    console.log("no user in session");
    res.locals.isLoggedIn = false;
  }
  next();
};

module.exports = dynamicNav;
