var express = require("express");
var router = express.Router();

const Restaurant = require("../models/Restaurant");

router.get('/', (req, res, next) => {
    const search = new RegExp(req.query.search, 'i') 
Restaurant.find({cuisineType: {$regex: search}})
    .limit(8)
    .then((results) => {
        results = results.map((result) => {
            return {...result._doc, imageSource: "/images/food.jpeg"}
        })
        console.log('search results', results)
        res.render('index.hbs', { results })
    })
    .catch((error) => {
        console.log(error)
    })
})






module.exports = router;