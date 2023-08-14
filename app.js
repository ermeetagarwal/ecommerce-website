require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose = require('mongoose');
const ejs = require("ejs")

const homeRouter = require(path.join(__dirname,"./routes/home"));
const productRouter = require(path.join(__dirname,"./routes/product"));
const app = express();
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use('/api/home',homeRouter);
app.use("/api/product",productRouter);
mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true ,  useNewUrlParser:true,useFindAndModify: false,useCreateIndex: true});
app.listen(3000, function () {
    console.log('Server started at port 3000');
});
