const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const bcrypt = require('bcrypt');

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};

passport.use('login', new LocalStrategy(function(username, password, done) {
  // Get user from db using select query, use first result and
  // store with session id
  // TODO: implement password hashing
  db.find({
    selector: {
      username: username,
    },
    sort: ['_id'],
    limit: 1,
  }).then((result) => {
    bcrypt.compare(password, result.docs[0].password).then(function(isMatch) {
      if (isMatch) {
        return done(null, result.docs[0]);
      } else {
        return done(null, false, {message: 'Invalid username or password'});
      };
    });
  }).catch((err) => {});
}));
