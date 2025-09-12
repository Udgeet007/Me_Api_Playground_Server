import express from 'express';
const app = express();
import connectToDB from './config/connection.js';
import profileRouter from './routes/profile.route.js';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://me-api-playground-client.vercel.app', // NO trailing slash
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
// app.use(cors({
//   origin:'https://me-api-playground-client.vercel.app/',
//   credentials:true
// }));
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