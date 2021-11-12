const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function isEmailValid(email){
  return emailPattern.test(email);
}

function passwortNotempty(pass){
  return (pass.trim().length > 0)
}

function checkEmailPassInDb(pool, email, pass) {
    pool.query(`SELECT * FROM users WHERE email=${email} AND pass=${pass};`, (result, err) => {
      console.log(result.rows)
      if (result.rows.length === 0) {
        return false
      }
    })
}


const SHA256 = require('crypto-js/sha256');

const hashedPassword = (password) => {
  return SHA256(password).toString()

}


const helpers = {
  isEmailValid,
  passwortNotempty,
  checkEmailPassInDb,
  hashedPassword
}


module.exports = helpers
