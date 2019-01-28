const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const { Pool, Client } = require('pg')

let fittingRoomItems = [];
let recommendationRequests = [];

const pool = new Pool({
  user: 'flash',
  host: 'localhost',
  database: 'flashroyale',
  password: 'postgresisl1fe',
  port: 5432,
})

// GET request to fetch row from apparel table matching requested id
app.get('/apparel/:id', cors(), (req, res) => {
  console.log(`GET request for /apparel/${req.params.id}`)
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
  })
})

// GET to fetch row from stock table matching apparel_id and store_name
app.get('/stock/:apparel_id/:store_name', cors(), (req, res) => {
  console.log(`GET request for 
    /stock/${req.params.apparel_id}/'${req.params.store_name}'`)
  pool.query(`SELECT * FROM stock s WHERE s.apparel_id=${req.params.apparel_id} AND s.store_name='${req.params.store_name}';`, (err, resp) => {
    console.log(err, resp)
    if (resp.rows.length === 0) {
      res.send(404)
    } else {
      res.send(resp.rows[0])
    }
  })
})

// Store items to be sent to a (empty) fitting room
// Called at counter step, when customer scans items he/she wants to try on
// Items stored in fittingRoomItems in the format:
// {fittingRoomNumber: 1, items: [2, 3, 4]}
app.post('/fitting_room/:room_num/(:items)*', cors(), (req, res) => {
  var items_array = String(req.params.items) + String(req.params[0]);
  console.log(items_array);
  var split_items = String(items_array).split('/').map(item => {
    return parseInt(item, 10)
  })
  const fittingRoomNum = req.params.room_num;
  console.log(split_items);
  fittingRoomItems.push({
    fittingRoomNumber: fittingRoomNum,
    items: split_items
  })
  console.log(fittingRoomItems);
  res.end();
})

// Fitting room sends a request to check for items currently mapped to it
app.get('/fitting_room/:room_num', cors(), (req, res) => {
  console.log(`GET request for /fitting_room/${req.params.room_num}`);
  const fittingRoomNum = req.params.room_num;
  var itemsInRoom = [];
  fittingRoomItems.forEach(fittingRoom => {
    if (fittingRoom.fittingRoomNumber === fittingRoomNum){
      itemsInRoom = fittingRoom.items;
    }
  })
  pool.query(`SELECT * FROM apparel a WHERE a.id = ANY($1::int[]);`,
    [itemsInRoom],
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

// GET request from fitting room to server for recommendations
// Select recommendations for a particular apparel based on same style
app.get('/recommendations/:apparel_id', cors(), (req, res) => {
  console.log(`GET request for /recommendations/${req.params.apparel_id}`)
  pool.query(`SELECT * FROM apparel a, stock s 
    WHERE a.id = s.apparel_id 
    AND a.style = (SELECT style FROM apparel a2 WHERE a2.id = ${req.params.apparel_id})
    AND s.quantity <> 0
    AND a.id <> ${req.params.apparel_id}
    ORDER BY a.price DESC
    LIMIT 3;`,
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

// POST request from fitting room to server to record recommendation fetch requests
app.post('/reco_request/:room_num/:apparel_id', cors(), (req, res) => {
  console.log(`POST request for /reco_request/${req.params.room_num}/${req.params.apparel_id} to be stored on server side`)
  recommendationRequests.push({
    fittingRoomNumber: req.params.room_num,
    item: req.params.apparel_id
  })
  console.log(`Storing request for apparel ${req.params.apparel_id} from room ${req.params.room_num}`)
})

// GET request from employee's phone to server to receive pending apparel fetch requests
// Send back entire recommendationRequests array to client
app.get('/phone_update', cors(), (req, res) => {
  console.log(` GET request for /phone_update`)
  res.send(recommendationRequests)
})

// POST request from fitting room to server to clear items mapped to that room when customer leaves the room
app.post('/empty_room/:room_num', cors(), (req, res) => {
  console.log(`POST request for /empty_room/${req.params.room_num}`)
  console.log(`Old state of fittingRoomItems: ${fittingRoomItems}`)
  let i = 0
  for (i = 0; i < fittingRoomItems.length; i++) {
    if (fittingRoomItems[i].fittingRoomNumber === req.params.room_num) {
      break
    }
  }
  fittingRoomItems.splice(i, 1)
  console.log(`Updated state of fittingRoomItems: ${fittingRoomItems}`)
})

app.use(express.static('public'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
