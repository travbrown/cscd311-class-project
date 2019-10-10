var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();

var Schema = mongoose.Schema;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Residency' });
});

router.post('/', function(req,res,next){
  res.redirect('/register');
  //route us to the register page
});


module.exports = router;
