import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    id: String,
    pin: String,
    name: String,
    level: String,
    gender: String,
  });

const Student = mongoose.model('Student', studentSchema);

export default Student;