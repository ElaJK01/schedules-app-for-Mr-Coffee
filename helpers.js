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

async function checkUserinDb(pool, id) {
  const res = await pool.query(`SELECT * FROM users WHERE id=${id};`)
  .then((result) => {return result.rows[0]})
  .catch(err => console.log(err))
  return res
}

function isFormValid(day, start, end) {
  if (day.trim().length > 0 && start.trim().length > 0 && end.trim().length > 0) {
    return true
  }
}

async function selectUserSchedules(pool, user) {
  const res = await pool
  .query(`SELECT user_id, day, to_char(start_at, 'HH24:MI') as start_at, to_char(end_at, 'HH24:MI') as end_at FROM users INNER JOIN schedules ON users.id=schedules.user_id WHERE user_id=${user}`)
  .then((result) => result.rows)
  .catch(err => console.log(err.stack))
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

function signupFormValid(name, lastname, email, pass, confPass) {
  if (name.trim().length > 0 && lastname.trim().length > 0 && email.trim().length > 0 && pass.trim().length > 0 && confPass.trim().length > 0 ) {
    return true
  }
}

async function checkEmailinDb(pool, email) {
  const resDb = await pool.query(`SELECT * FROM users WHERE email='${email}'`)
  .then((result) => {return result.rows[0]})
  .catch(err => console.log(err))
  return resDb
}


const helpers = {
  isEmailValid,
  passwortNotempty,
  hashedPassword,
  generateAuthToken,
  checkLogin,
  isFormValid,
  selectUserSchedules,
  checkUserinDb,
  signupFormValid,
  checkEmailinDb  
}


module.exports = helpers
