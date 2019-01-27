const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'flash',
  host: 'localhost',
  database: 'flashroyale',
  password: 'postgresisl1fe',
  port: 5432,
})

app.get('/apparel/:id', cors(), (req, res) => {
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
    //pool.end()
  })
})

app.get('/stock/:apparel_id/:store_name', cors(), (req, res) => {
  console.log(` GET request for 
    /stock/${req.params.apparel_id}/'${req.params.store_name}'`)
  pool.query(`SELECT * FROM stock s WHERE s.apparel_id=${req.params.apparel_id} AND s.store_name='${req.params.store_name}';`, (err, resp) => {
    console.log(err, resp)
    if (resp.rows.length === 0) {
      res.send(404)
    } else {
      res.send(resp.rows[0])
    }
    // pool.end()
  })
})

app.post('/fitting_room/:room_num/(:items)*', cors(), (req, res) => {
  const items_array = [req.params.items].concat(req.params[0].split('/').slice(1)).map(item => {
    return parseInt(item, 10)
  })
  console.log(` GET request for /fitting_room/${req.params.room_num}/${req.params.items.concat(req.params[0])}`)
  console.log('Fetching data for apparel_id: ' + items_array)
  pool.query(`SELECT * FROM apparel a WHERE a.id = ANY($1::int[]);`,
    [items_array],
    (err, resp) => {
    if (err) {
      console.log(err, resp)
      res.sendStatus(500)
      return
    }
    if (resp.rows.length === 0) {
      res.sendStatus(404)
      return
    }
    res.send(resp.rows)
  })
})

app.use(express.static('public'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
