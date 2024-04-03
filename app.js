var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();


app.use(cors());
app.use(logger('dev'));
// middleware supaya bisa terima req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', require('./routes/register'));
app.use('/auth', authRouter)
app.use('/users', usersRouter);

app.use('/admin/products', require('./routes/admin/product'));


module.exports = app;
