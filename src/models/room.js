import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
    roomNum: String,
    occupants: [],
  });

  roomSchema.pre('remove', function(next) {
    this.model('Student').deleteMany({ room: this._id }, next);
  });

const Room = mongoose.model('Room', roomSchema);

export default Room;