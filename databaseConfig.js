var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

  // we're connected!
  // Insert Mongoose hallSchema and logic here
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


mongoose.connect('mongodb://localhost:27017/cscd311-class-project-api', 
    {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true
    });