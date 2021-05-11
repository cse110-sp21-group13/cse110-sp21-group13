const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Send in a valid json containing just the id and it will be expunged from the
// database
module.exports = {
  '/delete/bullet': {
    methods: ['delete'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      db.get(req.body.id)
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
