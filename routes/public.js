var express = require('express');
var router = express.Router();


router.get('/', (req,res)=>{
  res.redirect('/');
});

router.get('/signup', function(req, res){
  res.render('users_signup', { title: '회원가입', message : req.flash('signupMessage')});
});


router.get('/signin', function(req, res){ 
  res.render('users_signin', { title: '로그인',message : req.flash('signinMessage')});
});
 
