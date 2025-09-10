import mongoose from 'mongoose';

const connectToDB = async() =>{
    await mongoose.connect(process.env.MONGODB_URI).then(() =>{
      console.log('Mongo DB Connected Successfully');
    }).catch((err)=>{
      console.log('Error in Connecting to Database', err);
    })
}

export default connectToDB;