var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var alert = require('alert-node');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
//var alert = require('alert-node');

var app = express();
mongoose.connect('mongodb://localhost:27017/cscd311-class-project-api', 
  {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
  });
var db = mongoose.connection;

// Setting up the Schemas for the Database structure
var Schema   = mongoose.Schema;
const roomSchema = new Schema({
  roomNum: Number,
  occupants: [String],
});
const Room = mongoose.model('room', roomSchema);

const studentSchema = new Schema({
  id: String,
  pin: String,
  name: String,
  level: String,
  gender: String,
});
const Student = mongoose.model('Student', studentSchema);

var currentUser = {
  id:String,
  pin:String,
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* GET home/login page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Residency' });
});

// POST saves login data in the submit form
app.post('/', function(req,res,next){
  if(req.body.id == null || req.body.pin == null){
    // Send an alert message that something is empty
    alert('Please fill out all fields');
  }else{
    currentUser.id = req.body.id;
    currentUser.pin = req.body.pin;
    res.render('register.ejs');
  }
  //sends us to this routing path established in app.js
});

// GET registration page
app.get('/register', function(req, res) {
  res.render('register');
});

/*POST Room registration. */
app.post('/register', function(req, res){
  console.log(req.body)
  if(req.body.name == '' || req.body.level == '' || req.body.gender == '' || req.body.room == ''){
        alert('Not all fields filled in!');
  }else{
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function() {
        console.log("Connection Successful!");
        var student = new Student(currentUser,req.body);

        student.save().then(item => {
          res.send("Saved to database");
          res.render('showdb.ejs');
        }).catch(err => {
          res.status(400).send("Unable to save to database", err);
        });
      });
    }
});




/// ERROR HANDLING
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
