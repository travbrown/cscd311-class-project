var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var register = require('./register');
//app.use('/register', register)
/* GET users listing. */
router.get('/', function(req, res) {
  res.render('register');
});

/*POST users listing. */
router.post('/', function(req, res){
  
  res.send(req.body);
});

module.exports = router;
