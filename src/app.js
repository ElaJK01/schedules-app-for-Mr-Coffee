const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const helpers = require('../helpers.js')
const path = require('path');
const bodyParser = require('body-parser');

const { Pool, Client } = require('pg');

const pool = new Pool({
  database: 'mr_c_auth_app',
  user: 'c_auth_user',
  password: 'coffee',
  host: 'localhost',
  port: 5432,
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get('/login', (req, res) => {
  res.render('login')
})

//todo: set session
app.post('/login', async (req, res, next) => {
  const emailValid = helpers.isEmailValid(req.body.email)
  const passwordNotempty = helpers.passwortNotempty(req.body.pass)
  const hashedPassword = helpers.hashedPassword(req.body.pass)
  
  if (emailValid && passwordNotempty) {
         
 await pool.query(`SELECT * FROM users WHERE email='${req.body.email}' AND pass='${hashedPassword}';`)
  .then(result => {
    if (result.rows.length === 0) {
      return res.send('Niepoprawne hasło lub login')
      
    } return res.redirect('homepage')
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(500);
    return;
  })
     
  } return res.send('wypełnij poprawnie dane!')  
})

app.get('/homepage', (req, res) => {
  return res.render('homepage')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
