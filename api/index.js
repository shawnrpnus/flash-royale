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
  pool.query(`SELECT * FROM apparel a WHERE a.id=${req.params.id};`, (err, resp) => {
    console.log(err, resp)
    res.send(resp.rows[0])
    pool.end()
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))