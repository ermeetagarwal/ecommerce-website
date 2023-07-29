require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

const homeRouter = require("./routes/home");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/',homeRouter);

mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true ,  useNewUrlParser:true});

app.listen(3000, function () {
    console.log('Server started at port 3000');
});
