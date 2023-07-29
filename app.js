require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const mongoose = require('mongoose');
const ejs = require("ejs")

const homeRouter = require(path.join(__dirname,"./routes/home"));

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.use('/',homeRouter);

mongoose.connect(process.env.DB_URL,{ useUnifiedTopology: true ,  useNewUrlParser:true});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });  
app.listen(3000, function () {
    console.log('Server started at port 3000');
});
