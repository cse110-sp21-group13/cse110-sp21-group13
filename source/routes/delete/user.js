const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Send in a valid json containing just the username and it will be
// expunged from the database
// Request json must be in the form:
// {
// "username": "the username of the document to retrieve",
// }
module.exports = {
  '/delete/user': {
    methods: ['delete'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      db.get(req.body.username)
          .then((response) => {
            db.remove(response._id, response._rev);
            res.send('success');
          })
          .catch((err) => {
            console.log(err);
            res.send('error');
          });
    },
  },
};
