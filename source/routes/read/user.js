const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Send in a valid json containing just the id and get back the document's json
// Request json must be in the form:
// {
// "username": "the username of the user to retrieve",
// }
// TODO: Remove? All we're returning is the username which is also the index queried to get the info
module.exports = {
  '/read/user': {
    methods: ['get'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      db.get(req.body.username)
          .then((response) => {
            response.username = response._id;  // Response body should use 'username' not '_id'
            delete response._id;
            delete response.password;  // Scrub password even though it's hashed
            res.send(response);
          })
          .catch((err) => {
            console.log(err);
            res.send('error');
          });
    },
  },
};