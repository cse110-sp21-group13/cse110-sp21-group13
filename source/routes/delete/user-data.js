const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Deletes ALL data associated with a user including the user itself
module.exports = {
  '/delete/user-data': {
    methods: ['delete'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      // create index for query
      db.createIndex({
        index: {
          fields: ['user'],
        },
      }).then((result) => {
        console.log(result);
      }).catch((err) => {
        res.send('error');
      });

      // delete every document belonging to user
      db.find({
        selector: {
          user: req.user._id,
        }
      })
      .then((response) => {
        response.docs.forEach((doc, index) => {
          db.remove(doc._id, doc._rev);
        });
        res.send('success');
      })
      .catch((err) => {
        console.log(err);
        res.send('error');
      });
    },
  },
};