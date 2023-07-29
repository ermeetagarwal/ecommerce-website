require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose = require('mongoose');

const homeRouter = require("./routes/home");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.use('/',path.join(__dirname,homeRouter));

mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true ,  useNewUrlParser:true});

app.listen(3000, function () {
    console.log('Server started at port 3000');
});
