// UserModel.js
     
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); // 암호화를 위한 모듈
    
// 스키마 설정
var userSchema = mongoose.Schema({
  name : String,
  email : String,
  password : String,
  isActive : Boolean,
  isSuper : Boolean,
  activationHash : String
});
    
// hash 생성
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// 값 비교
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password)
};

userSchema.methods.generateActivationHash = function(){
  return require('crypto').randomBytes(128).toString('hex');
};

   
module.exports = mongoose.model('User', userSchema);

