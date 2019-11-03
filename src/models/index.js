import mongoose from 'mongoose';
import Room from './room';
import Student from './student';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL,
    { reconnectTries: 5,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true 
  });
};

const models = { Room, Student };
export { connectDb };
export default models;