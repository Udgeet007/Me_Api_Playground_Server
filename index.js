import express from 'express';
const app = express();
import connectToDB from './config/connection.js';
import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT || 3000;


app.get('/', (req,res) =>{
  res.send('Server is Working');
})


app.listen(port, () =>{
  connectToDB();
  console.log(`Server is Running on Port: ${port}`);
})