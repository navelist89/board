var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config');


module.exports = function(mailto, verification_code){
  var mailOptions = {
    from: config.gmail_id,
    to: mailto,
    subject: 'MAIL test',
    text: "Please verify!\r\n http://35.229.250.77:3000/activate/"+verification_code
  };

  var transport = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth:{
      user: config.gmail_id,
      pass: config.gmail_pw
    }
  }));

  transport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log("Message sent : " + response.message);
    }
    transport.close();
  });


};
