const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Send in a valid json containing just the id and it will be expunged from the
// database
// Request json must be in the form:
// {
// "_id": "the ID of the document to retrieve",
// }
module.exports = {
  '/delete/bullet': {
    methods: ['delete'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      db.find({
        selector: {
          _id: req.body._id,
          user: req.user._id,
          docType: 'bullet',
        },
        limit: 1,
      })
          .then((response) => {
            // TODO: what happens if we try to read assuming multiple revisions?
            db.remove(response.docs[0]._id, response.docs[0]._rev);
            res.send('success');
          })
          .catch((err) => {
            console.log(err);
            res.send('error');
          });
    },
  },
};
