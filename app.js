require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose = require('mongoose');
const ejs = require("ejs");
const cors = require('cors');

const allowedOrigins = ['http://127.0.0.1:5500'];

const homeRouter = require(path.join(__dirname,"./routes/home"));
const productRouter = require(path.join(__dirname,"./routes/product"));
const app = express();

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
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
