const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function isEmailValid(email){
  return emailPattern.test(email);
}

function passwortNotempty(pass){
  return (pass.trim().length > 0)
}

const crypto = require('crypto');

function generateAuthToken(){
  return crypto.randomBytes(30).toString('hex');
}


const SHA256 = require('crypto-js/sha256');

const hashedPassword = (password) => {
  return SHA256(password).toString()

}


const helpers = {
  isEmailValid,
  passwortNotempty,
  hashedPassword,
  generateAuthToken
}


module.exports = helpers
