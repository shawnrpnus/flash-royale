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

pool.query('SELECT * FROM apparel;', (err, res) => {
  console.log(err, res)
  pool.end()
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))