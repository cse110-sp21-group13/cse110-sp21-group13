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
            // Remove the bullet itself
            db.remove(response.docs[0]._id, response.docs[0]._rev);
            res.send('success');
          }).then(()=> {
            // Delete all children
            db.find({
              selector: {
                parentBulId: req.body._id,
                user: req.user._id,
                docType: 'bullet',
              },
            }) .then((response) => {
              response.docs.forEach((doc, index) => {
                db.remove(doc._id, doc._rev);
              });
            })
                .catch((err) => {
                  console.log(err);
                });
          })
          .catch((err) => {
            console.log(err);
          });
    },
  },
};
