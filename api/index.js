const express = require('express')
const app = express()
const port = 3000
const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'flash',
  host: 'localhost',
  database: 'flashroyale',
  password: 'postgresisl1fe',
  port: 5432,
})

app.get('/apparel/:id', (req, res) => {
  console.log(` GET request for /apparel/${req.params.id}`)
  pool.query(`SELECT * FROM apparel a WHERE a.id=${req.params.id};`, (err, resp) => {
    if (err) {
      console.log(err)
      res.sendStatus(500)
      return
    }
    if (resp.rows.length === 0) {
      res.sendStatus(404)
      return
    }
    res.send(resp.rows[0])
    pool.end()
  })
})

app.use(express.static('public'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))