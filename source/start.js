<<<<<<< Updated upstream
const express = require('express');
const routescan = require('express-routescan');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
=======
const express = require('express'),
      routescan = require('express-routescan'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      path = require('path'),
      passport = require('passport');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
>>>>>>> Stashed changes
app.use(session({
  secret: 'anoshNSOEUnthoeuntTeNohesnas',
  resave: false,
  saveUninitialized: true,
<<<<<<< Updated upstream
  cookie: {secure: false, maxAge: Number(100000000)},
}));

// Globals
=======
  cookie: { secure: false, maxAge: Number(100000000) }
}));
app.use(passport.initialize());
app.use(passport.session());

//Globals
>>>>>>> Stashed changes

global._base = __dirname + '/';
global._env = app.get('env');
global._isDev = _env === 'development';
global._isProd = _env === 'production';

console.info = function(message) {
  console.log('[INFO] ' + message);
};

console.debug = function(message) {
  console.log('[DEBUG] ' + message);
};

console.critical = function(message) {
  console.log('[CRITICAL] ' + message);
};

<<<<<<< Updated upstream
routescan(app, {
  ignoreInvalid: true,
=======
const setUpPassport = require(_base + 'services/setup_passport');

setUpPassport();

routescan(app, {
  ignoreInvalid: true
>>>>>>> Stashed changes
});
app.use('/', express.static(path.join(_base, 'docs')));
app.use('/routes', express.static('routes'));

<<<<<<< Updated upstream
app.use(function(err, req, res, next) {
  console.debug('Error encountered: ' + err.message);
  console.error(err);
  res.json({error: err.message});
=======
app.use(function (err, req, res, next) {
  console.debug('Error encountered: ' + err.message);
  console.error(err);
  res.json({ error: err.message });
>>>>>>> Stashed changes
});

// HTTPS (don't have cert yet)
// let options = {
//     key: fs.readFileSync('privateKey.key'),
//     cert: fs.readFileSync('certificate.crt')
// };
// https.createServer(options, app).listen(3001);

<<<<<<< Updated upstream
const server = app.listen(3001, ()=>{
  console.log('API listening on port 3001');
});

module.exports = app;
module.exports = server;
=======
app.listen(3001, ()=>{
  console.log('API listening on port 3001');
});
>>>>>>> Stashed changes
