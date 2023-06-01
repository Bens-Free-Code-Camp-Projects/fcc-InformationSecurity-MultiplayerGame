require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet      = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use(helmet())
app.use(helmet.noCache())
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }));

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

let players = {}
let playerSize = 20
let collectible;
const io = socket(server)

io.on('connection', (socket) => {
  let newPlayer = {
    x: Math.floor(Math.random() * (640 - playerSize*2)) + playerSize, 
    y: Math.floor(Math.random() * (400 - playerSize*2)) + playerSize + 80, 
    score: 0, 
    id: socket.id, 
    size: playerSize
  }
  players[socket.id] = newPlayer
  socket.emit('new_player', {
    player: newPlayer,
    players: players
  })
  console.log('A user has connected')

  socket.on('console', (data) => {
    console.log(data)
  })

  socket.on('addPlayer', (data) => {
    players = data.players
    io.emit('addPlayer', {players: players})
  })

  socket.on('update', (data) => {
    players = data.players
    collectible = data.collectible
    io.emit('update', {players: players, collectible: collectible})
  })

  socket.on('disconnect', () => {
    delete players[socket.id]
    io.emit('update', {players: players, collectible: collectible})
    console.log('A user has disconnected')
  })
})

module.exports = app; // For testing
