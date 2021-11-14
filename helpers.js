const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function isEmailValid(email){
  return emailPattern.test(email);
}

function passwortNotempty(pass){
  return (pass.trim().length > 0)
}

async function checkLogin(pool, email, pass) {
  const res = await pool.query(`SELECT * FROM users WHERE email='${email}' AND pass='${pass}';`)
  .then((result) => result.rows[0])
  .catch(err  => console.log(err.stack))
  return res
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
  generateAuthToken,
  checkLogin,
  
}


module.exports = helpers
