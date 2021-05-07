const express = require('express'),
      routescan = require('express-routescan'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'anoshNSOEUnthoeuntTeNohesnas',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: Number(100000000) }
}));

//Globals

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

routescan(app, {
  ignoreInvalid: true
});
app.use('/', express.static(path.join(_base, 'docs')));
app.use('/routes', express.static('routes'));

app.use(function (err, req, res, next) {
  console.debug('Error encountered: ' + err.message);
  console.error(err);
  res.json({ error: err.message });
});

// HTTPS (don't have cert yet)
// let options = {
//     key: fs.readFileSync('privateKey.key'),
//     cert: fs.readFileSync('certificate.crt')
// };
// https.createServer(options, app).listen(3001);

app.listen(3001, ()=>{
  console.log('API listening on port 3001');
});
