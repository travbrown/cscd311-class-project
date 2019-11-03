import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import models, { connectDb } from './src/models';
import 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import alert from 'alert-node';
import createError from 'http-errors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();
var db = mongoose.connection;

var currentUser = {
  id: undefined,
  pin:undefined,
};

// view engine setup
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
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
app.post('/register', async (req, res) => {
  //console.log(req.body)
  if(req.body.name == '' || req.body.level == '' || req.body.gender == '' || req.body.room == ''){
        alert('Not all fields filled in!');
  }else{
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', async function() {
        console.log("Connection Successful!");
        const student = await Student.create({
          id: currentUser.id,
          pin: currentUser.pin,
          name: req.body.name,
          level: req.body.level,
          gender: req.body.gender
        }).then(student =>{
          student.save().then(item => {
            res.send("Saved to database");
            res.render('showdb.ejs');
          }).catch(err => {
            res.status(400).send("Unable to save to database", err);
          });
        }).catch(err);
      }).catch(err => {
        res.send("Failed to Connect :(");
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

const eraseDatabaseOnSync = true;

  // boot if db is available
  connectDb().then(async () => {
      //Erase database upon start
    if (eraseDatabaseOnSync) {
      await Promise.all([
        models.Room.deleteMany({}),
        models.Student.deleteMany({}),
      ]);
      // Seed DB
      createRoomsWithStudents();
    }

    app.listen(process.env.PORT, () =>
      console.log(`App listening on port ${process.env.PORT}!`),
    );
  }).catch(dbErr => {
  console.log("DB Connection Error: ", dbErr.message);
  process.exit(1);
});

const createRoomsWithStudents = async () => {
  const room1 = new models.Room({
    roomNum: 34,
    occupants: [],
  });

  const student1 = new models.Student({
    text: 'Published the Road to learn React',
    room: room1.id,
  });
  await student1.save();

  await room1.save();
};

module.exports = app;
