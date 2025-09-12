import express from 'express';
const app = express();
import connectToDB from './config/connection.js';
import profileRouter from './routes/profile.route.js';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors({
  origin:process.env.ALLOWED_ORIGINS,
  credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/', (req,res) =>{
  res.send('Health for Liveness');
})

app.use('/api/profile', profileRouter);

app.listen(port, () =>{
  connectToDB();
  console.log(`Server is Running on Port: ${port}`);
})