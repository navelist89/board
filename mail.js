var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config');

var transport = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth:{
    user: config.gmail_id,
    pass: config.gmail_pw
  }
}));

var mailOptions = {
  from: 'navelist89@gmail.com',
  to: 'navelist89@gmail.com',
  subject: 'MAIL test',
  text: "Please verify  !"

};

transport.sendMail(mailOptions, function(error, response){
  if(error){
    console.log(error);
  }else{
    console.log("Message sent : " + response.message);
  }
  transport.close();
});


