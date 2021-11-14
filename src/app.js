const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
const helpers = require('../helpers.js')
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

app.use(cookieParser());

app.get('/login', (req, res) => {
  res.render('login')
})

const authTokens = {};

app.use((req, res, next) => {
  const authToken = req.cookies['AuthToken'];
  req.user = authTokens[authToken];
  next();
});

app.post('/login', async (req, res, next) => {
  const emailValid = helpers.isEmailValid(req.body.email)
  const passwordNotempty = helpers.passwortNotempty(req.body.pass)
  const hashedPassword = helpers.hashedPassword(req.body.pass)
  
  if (emailValid && passwordNotempty) {
    try {
     const result = await helpers.checkLogin(pool, req.body.email, hashedPassword)
      if (result === undefined) {
          return res.send('Niepoprawne hasło lub login')
        } else { 
            const user = result.id
            if (user){
            const authToken = helpers.generateAuthToken()
            authTokens[authToken] = user;
            res.cookie('AuthToken', authToken);
            return res.redirect('homepage')
          }
        }
      
    } catch (e) {
      console.log(e)
}
      
} return res.send('wypełnij poprawnie dane!')

})


app.get('/homepage', (req, res) => {
  if (req.user) {
   pool
   .query(`SELECT * FROM users INNER JOIN schedules ON users.id=schedules.user_id;`)
   .then(result => {return res.render('homepage', {schedules: result.rows})})
   .catch((e) => console.error(e))
  } else {
    res.send('proszę zaloguj się!')
  }
  
})


app.get('/employee/:id', (req, res) => {
  if (req.user) {
    pool.query(`SELECT user_id, firstname, lastname, email, day, start_at, end_at FROM users INNER JOIN schedules ON users.id=schedules.user_id WHERE user_id=${req.params.id};`)
    .then(result => { if (result.rows.length === 0) {
      return res.send('nie ma takiego użytkownika')
    } return res.render('employee', {user: result.rows[0], userData: result.rows})})
    .catch((e) => console.error(e))
} else {
  return res.send('zaloguj się')
}
})


app.get('/add-schedules', (req, res) =>{
  const user=req.user
  try {
    if (user){
      pool.query(`SELECT * FROM schedules WHERE user_id=${user}`)
      .then(result => {return res.render('add-schedules', {schedules: result.rows})})
      .catch((e) => console.error(e))
    } else {
      return res.redirect('/login')
    }
  } catch (e) {
    console.log(e)
  }
})

async function addTodb(q){
  pool.query(q, (err, result) => {
    if (err) {
      console.log(err.stack)
    } return result
  })
}

app.post('/add-schedules', async (req, res) => {
  if (req.user) {
    if (helpers.isFormValid(req.body.day, req.body.start_at, req.body.end_at)) {
      try {
        const dbRes = await helpers.checkUserinDb(pool, req.user)
        if (dbRes === undefined){
          res.send('Nie ma takiego uzytkownika. nie można dodać schedula')
        } else {
          const insertScheduleQuery = `INSERT INTO schedules (user_id, day, start_at, end_at) VALUES (${req.user}, '${req.body.day.toLowerCase()}', '${req.body.start_at}', '${req.body.end_at}')` 
          const userSchedulsList = await helpers.selectUserSchedules(pool, req.user)
          const ThisdayInUserSchedules = userSchedulsList.filter(e =>  e.day === req.body.day.toLowerCase())
             if (ThisdayInUserSchedules.length === 0) {
              addTodb(insertScheduleQuery) 
              return res.send('schedule dodany!')
              }
         const scheduleInTheSameTime = ThisdayInUserSchedules.filter(e => (e.start_at === req.body.start_at || (e.start_at < req.body.end_at
                && e.end_at < req.body.start_at)) || (e.start_at < req.body.start_at && e.end_at < req.body.end_at))
               if (scheduleInTheSameTime.length > 0) {
                     return res.send('W tym czasie masz już zaplanowane spotkanie')
                   } addTodb(insertScheduleQuery)
                    return res.send('schedule dodany!')
              }

      } catch (err) {
        console.log(err)

      }  

      
             
      

    } return res.send('Wypełnij wszystkie pola')
  } else {
    return res.send('zaloguj się!')
  }
})

app.get('/logout', (req, res) => {
  if (req.user) {
    return res.render('logout')
  } else {
    return res.send('nie jesteś zalogowany')
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('AuthToken')
  delete authTokens[req.cookies['AuthToken']]
  return res.send('Jesteś wylogowany')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
