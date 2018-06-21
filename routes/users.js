
var express = require('express');
var passport = require('passport'); // passport를 가져와야되요
var router = express.Router();
var User = require('../models/User');

function isAuth(req, res, next){
  if (req.user)
    if (req.user.isActive){
      return next();
    }
    else
      res.render('inactive', {user:req.user});
  else
    res.render('denied', {user:req.user});
}
  
// 페이지 렌더링입니다.
router.get('/', function(req, res){
  res.render('index', {title : '메인', user : req.user}); // 로그인에 성공할시 req.user에 세션값이 담겨있게됩니다.
});
    
router.get('/signin', function(req, res){ // link는 페이지를 분기치기위한 수단과 요청보낼 주소입니다.   
  res.render('sign', { title: '로그인', link : 'users/signin', message : req.flash('signinMessage')});
});
    
router.get('/signup', function(req, res){
  res.render('sign', { title: '회원가입', link : 'users/signup', message : req.flash('signupMessage')});
});
    
// 로그아웃
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/info', isAuth, function(req, res){
  res.render('userinfo', {user:req.user});
});


router.get('/activate/:hash' ,(req,res,next)=>{
  User.findOne({'activationHash':req.params.hash}, function(err,user){
    if (err) return;
    if (!user) return res.render('inactive', {message:req.flash('Nonexisting Hash')});
    user.activationHash = "";
    user.isActive = true;
    user.save();
  });
});

/*
router.post('/signin',
    function(req, res, next){
      console.log(req.body);
      next();});
*/
      
// 요청에따른 전략설정입니다.
router.post('/signin', passport.authenticate('local-signin', {
  successRedirect : '/', // 성공시 보내질 요청입니다.
  failureRedirect : '/users/signin', // 실패시 보내질 요청입니다.
  failureFlash : true
}));

//router.post('/signin', function(req,res){console.log('1');});

      
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/users/signup',
  failureFlash : true
}));
      
module.exports = router;

