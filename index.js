import express from 'express';
const app = express();
import dotenv from 'dotenv'
dotenv.config();
const port = process.env.PORT || 3000;

app.get('/', (req,res) =>{
  res.send('Server is Working');
})


app.listen(port, () =>{
  console.log(`Server is Running on Port: ${port}`);
})