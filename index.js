import express from 'express';
const app = express();
import connectToDB from './config/connection.js';
import profileRouter from './routes/profile.route.js';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'https://me-api-playground-client.vercel.app',
  'https://me-api-playground-client-hxhwf6gp2-udgeet-bhatts-projects.vercel.app',
  'http://localhost:3000' // for local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(cors(corsOptions));

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