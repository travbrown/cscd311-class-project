import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    id: String,
    pin: String,
    name: String,
    level: String,
    gender: String,
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  });

  //Makes it so that students can sign via ID
  studentSchema.statics.findById = async function (id) {
    let student = await this.findOne({
      id: id,
      unique: true
    });
    return student;
  };

const Student = mongoose.model('Student', studentSchema);

export default Student;