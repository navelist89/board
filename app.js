var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var mongoose = require('mongoose');
var passport = require('passport');

require('./passport')(passport);

// DB 설정
mongoose.connect('mongodb://root:123qwe@ds241570.mlab.com:41570/login_tutorial');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Conneted mongoDB');
});

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// app.set('view engine', 'ejs'); .... 아래에 추가해주세요
app.use(session({ 
  secret: '비밀코드', 
  resave: true, 
  saveUninitialized: true 
})); // 세션 활성화

app.use(function(req,res,next){
    res.locals.user = req.user;
    next();
});
    
// flash는 세션을 필요로합니다. session 아래에 선언해주셔야합니다.
app.use(flash());   

      
// passport 초기화 =
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));


/*
var User = require('./models/User');
User.findOne({'email':'navelist89@gmail.com'}, function(err,user){
  if(err) {console.log(err);return;}
  if (user){ console.log(user);return;}
  console.log('hello');
});
*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(indexRouter.auth);
app.use('/users', usersRouter);

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

module.exports = app;
