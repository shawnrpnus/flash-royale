const express = require('express')
const https = require('https')
const http = require('http')
const bodyParser = require('body-parser');
const fs = require('fs')
const app = express()
app.use(bodyParser.json())
const cors = require('cors')
const port = 80
const { Pool, Client } = require('pg')

const NUM_FITTING_ROOMS = 4

let fittingRoomItems = []
let recommendationRequests = []
let transitRequests = []

const instructions = {} 

const pool = new Pool({
  user: 'flashroyale_sa@flashroyale-postgres',
  host: 'flashroyale-postgres.postgres.database.azure.com',
  database: 'flashroyalepostgres',
  password: 'zaq1@WSX',
  port: 5432,
})

// Clears the request/item array item matching a specific roomNumber
// Called by empty_room POST request
function clearArrayByRoom(roomArray, roomNumber) {
  return roomArray.filter((x) => {
    return parseInt(x.fittingRoomNumber, 10) !== roomNumber
  })
}

// Handle SQL query errors
// Return false if error occurred for query, else true
function hasSqlQueryErrors(res, err, resp) {
  if (err) {
    console.log(err, resp)
    res.sendStatus(500)
    return true
  }
  if (resp.rows.length === 0) {
    res.sendStatus(404)
    return true
  }
  return false
}

// GET request to fetch row from apparel table matching requested id
app.get('/apparel/:id', cors(), (req, res) => {
  console.log(`GET request for /apparel/${req.params.id}`)
  pool.query(`SELECT * FROM apparel a WHERE a.id=${req.params.id};`, (err, resp) => {
    if (!hasSqlQueryErrors(res, err, resp)) {
      res.send(resp.rows[0])
    }
  })
})

// GET request to find empty fitting rooms
app.get('/find_empty_room', cors(), (req, res) => {
  console.log(`GET request for /find_empty_room`)
  let temp = []
  let result = [1, 2, 3, 4]
  fittingRoomItems.forEach((x) => {
    temp.push(x.fittingRoomNumber)
  })
  res.send(result.filter((x) => {return !temp.includes(x)}))
})

// GET to fetch row from stock table matching apparel_id and store_name
app.get('/stock/:apparel_id/:store_name', cors(), (req, res) => {
  console.log(`GET request for 
    /stock/${req.params.apparel_id}/'${req.params.store_name}'`)
  pool.query(`SELECT * FROM stock s WHERE s.apparel_id=${req.params.apparel_id} AND s.store_name='${req.params.store_name}';`, (err, resp) => {
    if (!hasSqlQueryErrors(res, err, resp)) {
      res.send(resp.rows[0])
    }
  })
})

// Store items to be sent to a (empty) fitting room
// Called at counter step, when customer scans items he/she wants to try on
// Items stored in fittingRoomItems in the format:
// {fittingRoomNumber: 1, items: [2, 3, 4]}
app.post('/fitting_room/:room_num/(:items)*', cors(), (req, res) => {
  console.log(`POST request for /fitting_room/${req.params.room_num}/${req.params.items}/${req.params[0]}`)
  var items_array = String(req.params.items) + String(req.params[0]);
  var split_items = String(items_array).split('/').map(item => {
    return parseInt(item, 10)
  })
  const fittingRoomNum = req.params.room_num;
  fittingRoomItems.push({
    fittingRoomNumber: fittingRoomNum,
    items: split_items
  })
  console.log(`Updated state of fittingRoomItems: ${JSON.stringify(fittingRoomItems)}`);
  res.sendStatus(200)
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
      if (!hasSqlQueryErrors(res, err, resp)) {
        res.send(resp.rows)
      }
    })
})

// GET request from fitting room to server for recommendations
// Select recommendations for a particular apparel based on same style
app.get('/recommendations/:apparel_id', cors(), (req, res) => {
  console.log(`GET request for /recommendations/${req.params.apparel_id}`)
  pool.query(`SELECT * FROM apparel a, stock s
    WHERE a.id = s.apparel_id
    AND a.style = (SELECT style FROM apparel a2 WHERE a2.id = ${req.params.apparel_id})
    AND a.id <> ${req.params.apparel_id}
    AND s.quantity <> 0
    AND a.image IN (
      SELECT DISTINCT a1.image
      FROM apparel a1, stock s1                                                                                 WHERE a.id = s.apparel_id
      AND a1.style = (SELECT style FROM apparel a2 WHERE a2.id = ${req.params.apparel_id})
      AND a1.id <> ${req.params.apparel_id}
      AND s1.quantity <> 0
      AND a1.image <> (SELECT image FROM apparel a2 WHERE a2.id = ${req.params.apparel_id})
      LIMIT 3
    )
    ORDER BY a.price DESC;`, (err, resp) => {
      // Handle errors
      if (!hasSqlQueryErrors(res, err, resp)) {
        res.send(resp.rows)
      }
    })
})

// POST request from fitting room to server to record recommendation fetch requests
app.post('/reco_request/:room_num/:apparel_id', cors(), (req, res) => {
  console.log(`POST request for /reco_request/${req.params.room_num}/${req.params.apparel_id} to be stored on server side`)
  pool.query(`SELECT * FROM apparel a, stock s
    WHERE a.id = s.apparel_id AND a.id = ${req.params.apparel_id};`, (err, resp) => {
      if (!hasSqlQueryErrors(res, err, resp)) {
        recommendationRequests.push({
          fittingRoomNumber: parseInt(req.params.room_num, 10),
          item: resp.rows[0]
        })
      }
    })
  console.log(`Storing request for apparel ${req.params.apparel_id} from room ${req.params.room_num}`)
  res.sendStatus(200)
})

// GET request from employee's phone to server to receive pending 
// apparel fetch requests
// Send back entire recommendationRequests array to client
app.get('/phone_update', cors(), (req, res) => {
  console.log(` GET request for /phone_update`)
  res.send(recommendationRequests)
})

// POST request from employee's phone page to server to shift apparel from 
// pending status to in transit status
// Called when employee accepts request to fetch the item
app.post('/accept_request/:room_num/:apparel_id', cors(), (req, res) => {
  console.log(`POST request for /accept_request/${req.params.room_num}/${req.params.apparel_id}`)
  let i = 0
  for (i = 0; i < recommendationRequests.length; i++) {
    if ((recommendationRequests[i].fittingRoomNumber === parseInt(req.params.room_num, 10))
      && (recommendationRequests[i].item.id === parseInt(req.params.apparel_id, 10))) {
      break
    }
  }
  const request = recommendationRequests[i]
  recommendationRequests.splice(i, 1)
  transitRequests.push(request)
  console.log(`request for apparel id ${req.params.apparel_id} from room ${req.params.room_num} has been accepted`)
  console.log(`Updated state of transitRequests: ${JSON.stringify(transitRequests)}`)
  res.sendStatus(200)
})

// GET request from employee's phone to receive in-transit items
app.get('/check_transit_items', cors(), (req, res) => {
  console.log(` GET request for /check_transit_items`)
  res.send(transitRequests)
})

// POST request from employee's phone to server to mark in transit items as delivered
app.post('/delivered/:room_num/:apparel_id', cors(), (req, res) => {
  console.log(`POST request for /delivered/${req.params.room_num}/${req.params.apparel_id}`)
  transitRequests = transitRequests.filter((x) => {
    return x.fittingRoomNumber !== parseInt(req.params.room_num, 10) ||
    x.item.id !== parseInt(req.params.apparel_id, 10)
  })
  console.log(`Apparel id ${req.params.apparel_id} has been delivered to room ${req.params.room_num}`)
  console.log(`Updated state of transitRequests: ${JSON.stringify(transitRequests)}`)
  res.sendStatus(200)
})

// POST request from fitting room to server to clear items mapped to that room 
// when customer leaves the room
app.post('/empty_room/:room_num', cors(), (req, res) => {
  console.log(`POST request for /empty_room/${req.params.room_num}`)
  console.log(`Old state of fittingRoomItems: ${fittingRoomItems}`)
  console.log(`Old state of fittingRoomItems: ${recommendationRequests}`)
  console.log(`Old state of fittingRoomItems: ${transitRequests}`)

  // Clear all items from corresponding index in fittingRoomItems
  fittingRoomItems = clearArrayByRoom(fittingRoomItems, parseInt(req.params.room_num, 10))
  console.log(`Updated state of fittingRoomItems: ${JSON.stringify(fittingRoomItems)}`)

  // Clear all requests from corresponding room in recoRequests
  recommendationRequests = clearArrayByRoom(recommendationRequests, parseInt(req.params.room_num, 10))
  console.log(`Updated state of recommendationRequests: ${JSON.stringify(recommendationRequests)}`)

  // Clear all requests from corresponding room in transitRequests
  transitRequests = clearArrayByRoom(transitRequests, parseInt(req.params.room_num, 10))
  console.log(`Updated state of transitRequests: ${JSON.stringify(transitRequests)}`)

  res.sendStatus(200)
})

// place instruction in instructions object, wait for the frontend to get it
app.post('/action/:room_num', cors(), (req, res) => {
  console.log(`POST request for /action/${req.params.room_num}`)
  console.log(req.body)
  instructions[req.params.room_num] = req.body
  res.sendStatus(200)
})

// frontend will call this endpoint every second to get its pending instructions
app.get('/action/:room_num', cors(), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  console.log(`GET request for /action/${req.params.room_num}`)
  let ans = instructions[req.params.room_num]
  if (ans === null) {
    ans = {}
  }
  res.send(JSON.stringify(ans))
  // remove it after sending
  // donald's a lil bitch
  delete instructions[req.params.room_num]
})

app.use(express.static('public'))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.listen(port, () => {
//  console.log(`Example app listening on port ${port}!`)
//})

const options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem')
}

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);