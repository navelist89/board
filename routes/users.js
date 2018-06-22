
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
    
   
// 로그아웃
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/info', function(req, res){
  res.render('userinfo', {user:req.user});
});


router.get('/activate/:hash' ,(req,res,next)=>{
  User.findOne({'activationHash':req.params.hash}, function(err,user){
    if (err) return res.redirect('/');
    if (!user) return res.render('inactive', {message:'Nonexisting Hash'});
    user.activationHash = "";
    user.isActive = true;
    user.save();
    res.redirect('/');
  });
});

/*
router.post('/signin',
    function(req, res, next){
      console.log(req.body);
      next();});
*/
     
module.exports = router;

