let passport = require('passport');
let localStrategy = require('passport-local').Strategy;
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
}

passport.use('login', new localStrategy(function(username, password, done) {
  // Get user from db using select query, use first result and store with session id
  // TODO: implement password hashing
  db.find({
    selector: {
      username: username,
      password: password
    },
    sort: ['_id'],
    limit: 1
  }).then((result) => {
    return done(null, result.docs[0]);
  }).catch((err) => {
    return done(null, false,
      { message: "Invalid username or password" });
  });
}));