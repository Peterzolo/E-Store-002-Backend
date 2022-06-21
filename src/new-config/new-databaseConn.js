import mongoose from 'mongoose';

export const mongoConnection = async () => {
  try {
    const mongoDB = await mongoose.connect(process.env.MONGODB_URI);
    console.log('mongoDB connected successfully');
  } catch (error) {
    console.log(error);
  }
};
