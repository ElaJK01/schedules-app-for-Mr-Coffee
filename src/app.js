const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/login', (req, res) => {
  res.render('login')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
