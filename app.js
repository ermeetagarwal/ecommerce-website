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

mongoose.connect('mongodb+srv://admin-meet:9T33UlgY7hLtjpJd@agarwalfoods.ti4t1uv.mongodb.net/agarwalfoodsDB',{ useUnifiedTopology: true ,  useNewUrlParser:true});

app.listen(3000, function () {
    console.log('Server started at port 3000');
});
