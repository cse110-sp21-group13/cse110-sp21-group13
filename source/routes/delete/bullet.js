const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');


// Send in a valid json containing just the id and it will be expunged from the
// database
// Request json must be in the form:
// {
// "_id": "the ID of the document to retrieve",
// }
module.exports = {
  '/delete/bullet': {
    methods: ['delete'],
    fn: function(req, res, next) {
      db.get(req.body._id)
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
