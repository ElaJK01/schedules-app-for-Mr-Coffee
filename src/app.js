const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const helpers = require('../helpers.js')
const path = require('path');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const emailValid = helpers.isEmailValid(req.body.email)
  
  if (emailValid) {
    return res.send('email ok')
  } 
    return res.send('wrong email')
//2. spr czy passwor format ok. - no empty spaces and white signs
//3. checkIfemail in db

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
