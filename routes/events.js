var express = require('express');
var router = express.Router();


router.get('/all-events', (req, res, next) => {
  res.render('events/all-events.hbs');
});

module.exports = router;