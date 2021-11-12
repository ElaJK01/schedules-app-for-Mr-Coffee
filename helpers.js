const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function isEmailValid(email){
  return emailPattern.test(email);
}

function passwortNotempty(pass){
  return (pass.trim().length > 0)
}

async function checkEmailPassInDb(pool, email, pass) {
  await pool.query(`SELECT * FROM users WHERE email='${email}' AND pass='${pass}';`)
  .then(result => {
    if (result.rows.length === 0) {
      return res.send('Niepoprawne hasło lub login')
    } return res.send('zalogowano')
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
    return;
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
