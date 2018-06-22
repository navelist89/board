var express = require('express');
var passport = require('passport'); // passport를 가져와야되요
var router = express.Router();
var User = require('../models/User');


/* GET home page. */
router.get('/',
    auth,
    (req,res)=>{
      res.render('index', { title: 'Hello World!', user:req.user});
    }
);

router.get('/signup', function(req, res){
  res.render('users_signup', { title: '회원가입', message : req.flash('signupMessage')});
});


router.get('/signin', function(req, res){ 
  res.render('users_signin', { title: '로그인',message : req.flash('signinMessage')});
});


router.get('/activate/:hash*?' ,(req,res,next)=>{
  if(req.params.hash){
    User.findOne({'activationHash':req.params.hash}, function(err,user){
      if (err) return res.redirect('/');
      if (!user) return res.render('inactive', {message:'Nonexisting Hash'});
      user.activationHash = "";
      user.isActive = true;
      user.save();
      res.redirect('/');
    });
    }

  if(req.user && req.user.isActive)
    res.redirect('/');
  res.render('activate', {user:req.user});
  }

);


router.post('/signin',

  passport.authenticate('local-signin', {
    failureRedirect : '/users/signin', 
    failureFlash : true
  }),

  function(req, res, next) {
    if (!req.body.remember_me) { return next(); }

    var token = utils.generateToken(64);
    Token.save(token, { userId: req.user.id }, function(err) {
      if (err) { return done(err); }
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 * 30 }); // 30 days
      return next();
    });
  },
  
  function(req,res){
    res.redirect('/');
  }
  

);


      
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/users/signup',
  failureFlash : true
}));
 


function auth(req, res, next){
  if(!req.user){
    res.redirect('/signin');
    return;
  }
  if(!req.user.isActive){
    res.redirect('/activate');      
    return;
  }
  return next();
}

module.exports = router;
module.exports.auth = auth;
