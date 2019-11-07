import 'dotenv/config';
import express from 'express';
import models, { connectDb } from './src/models';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import alert from 'alert-node';
import createError from 'http-errors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { model } from 'mongoose';
import { isNull } from 'util';

const app = express();

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
app.post('/', async (req,res,next) => {
  if(req.body.id == null || req.body.pin == null){
    // Send an alert message that something is empty
    alert('Please fill out all fields');
  }else{

    currentUser.id = req.body.id;
    currentUser.pin = req.body.pin;
    res.render('register.ejs');
  }
});

// GET registration page
app.get('/register', function(req, res) {
  res.render('register');
});

/*POST Room registration. */
app.post('/register', async (req, res) => {
  if(req.body.name == '' || req.body.level == '' || req.body.gender == '' || req.body.room == ''){
    alert('Not all fields filled in!');
  }else{
    // Fetching the room and checking capacity    
    models.Room.findOne({roomNum: req.body.room},'occupants').then((room) => {
      if(!isNull(room)){
        
        if (room.occupants.length >= 4){
          alert('This room is full. Please choose another!');
          res.render('register');
        }else{
          // Adding student to room and saving their data
          room.occupants.push(currentUser.id);
          models.Student.findOneAndUpdate({
            id: currentUser.id,
            pin: currentUser.pin
          },
          {
            name: req.body.name,
            level: req.body.level,
            gender: req.body.gender,
          },
          {
            upsert: true,
            new: true,
          }).then(student => student.save()).catch(
            err => console.log('failed to create new student for existing room' + err)
            );
          
        }
      }else{
        // Creating room w/ student & saving student data
        models.Room.findOneAndUpdate({},{
          roomNum: req.body.room,
          occupants: [currentUser.id],
        },{
          new: true,
          upsert: true,
        }).then(
          room => room.save()
          ).catch(
            err => console.log('failed to create new room' + err)
            );

        models.Student.findOneAndUpdate({
          id: currentUser.id,
          pin: currentUser.pin
        },
        {
          name: req.body.name,
          level: req.body.level,
          gender: req.body.gender,
        },
        {
          upsert: true,
          new: true,
        }).then(student => student.save()).catch(
          err => console.log('failed to create new student' + err)
          );
      }
    console.log(room.occupants);
    
    }).catch(err => console.log('failed outside of room/stud promises' + err));
    res.render('showdb');
  }
});

app.get('/showdb', async (req, res) => {
  // Get & render entire rooms collection
  res.render('showdb.ejs');
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
  res.send("DB Connection Error: ", dbErr.message);
  process.exit(1);
});

//const bookingProcess = async (val) => {};

const createRoomsWithStudents = async () => {


  const room1 = new models.Room({
    roomNum: 34,
    occupants: [],
  });

  const student1 = new models.Student({
    id: '10784295',
    pin: '73524',
    name: 'Abena',
    level: '100',
    gender: 'F',
  });

  await student1.save();
  await room1.save();
};

module.exports = app;
