var express = require('express');
var stringSimilarity = require('string-similarity');
var router = express.Router();

const carsData = require("../cars.json")

router.get('/cars', function(req, res, next) {
  if(req.query.search){
    var result = stringSimilarity.findBestMatch(req.query.search, 
      carsData.map((item) => (item.make+" "+item.model+" "+item.body_styles[0]).toLowerCase())
    ).ratings.sort((a, b) => b.rating - a.rating).map(a => a.target)
    .filter((value, index, self) => self.indexOf(value) === index)
    .splice(0, 3)
    res.json({ type: 'ok', result })
  }else{
    res.status(300).json({ type: 'bad params' })
  }
});

router.get('/bodyTypes', function(req, res, next) {
  const result = carsData.map((item) => item.body_styles).flat()
  .filter((value, index, self) => self.indexOf(value) === index)
  res.json({ type: 'ok', result })
});

module.exports = router;
