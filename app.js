import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import ejs from 'ejs';
import cors from 'cors';

// Importing all routes
import homeRouter from "./routes/home.js";
import productRouter from "./routes/product.js";
const allowedOrigins = ['http://127.0.0.1:5500'];

const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use('/api/home',homeRouter);
app.use("/api/product",productRouter);
app.use(
    cors({
      origin: function (origin, callback) {
        // Check if the requesting origin is allowed
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    })
);

mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true ,  useNewUrlParser:true,useFindAndModify: false,useCreateIndex: true});

app.listen(3000, function () {
    console.log('Server started at port 3000');
});
