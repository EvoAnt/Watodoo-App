var express = require('express');
var router = express.Router();


router.get('/community', (req, res, next) => {
  res.render('community/community.hbs');
});

module.exports = router;
