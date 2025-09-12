import express from 'express';
const app = express();
import connectToDB from './config/connection.js';
import profileRouter from './routes/profile.route.js';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
// const corsOptions = {
//   origin: 'https://me-api-playground-client.vercel.app', // NO trailing slash
//   optionsSuccessStatus: 200 // For legacy browser support
// };
// app.use(cors(corsOptions));

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