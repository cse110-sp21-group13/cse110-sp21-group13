const express = require('express');
const routescan = require('express-routescan');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const fs = require('fs');
const https = require('https');
const app = express();

const useHttps = false; // Toggle HTTPS

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'anoshNSOEUnthoeuntTeNohesnas',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: Number(100000000)},
}));
app.use(passport.initialize());
app.use(passport.session());

// Globals

global._base = __dirname + '/';
global._env = app.get('env');
global._isDev = _env === 'development';
global._isProd = _env === 'production';
global._saltRounds = 4; // Used for bcrypt

console.info = function(message) {
  console.log('[INFO] ' + message);
};

console.debug = function(message) {
  console.log('[DEBUG] ' + message);
};

console.critical = function(message) {
  console.log('[CRITICAL] ' + message);
};

const setUpPassport = require(_base + 'services/setup_passport');

setUpPassport();

routescan(app, {
  ignoreInvalid: true,
});
app.use('/', express.static(path.join(_base, 'docs')));
app.use('/routes', express.static('routes'));

app.use(function(err, req, res, next) {
  console.debug('Error encountered: ' + err.message);
  console.error(err);
  res.json({error: err.message});
});

// Start Express Server
if (useHttps) {
  // HTTPS
  const options = {
    key: fs.readFileSync('private-key.key'),
    cert: fs.readFileSync('certificate.crt'),
  };
  const server =
    https.createServer(options, app).listen(process.env.PORT || 3001);
  module.exports = server;

  // Maintain a hash of all connected sockets
  var sockets = {}, nextSocketId = 0;
  server.on('connection', function (socket) {
    // Add a newly connected socket
    var socketId = nextSocketId++;
    sockets[socketId] = socket;
    console.log('socket', socketId, 'opened');

    // Remove the socket when it closes
    socket.on('close', function () {
      console.log('socket', socketId, 'closed');
      delete sockets[socketId];
    });

    // Extend socket lifetime for demo purposes
    socket.setTimeout(4000);
  });

  // Close the server
  server.close(function () { console.log('Server closed!'); });
  // Destroy all open sockets
  for (let socketId in sockets) {
    console.log('socket', socketId, 'destroyed');
    sockets[socketId].destroy();
  }

  console.log('API listening on port 3001; using SSL');
} else {
  // HTTP
  const server = app.listen(process.env.PORT || 3001, ()=>{
    console.log('API listening on port 3001');
  });
  module.exports = server;
}

module.exports = app;
