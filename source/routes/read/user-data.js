const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

/* *
returns every document in the entire database that is owned by the current user;
used for data transparency, allowing for a user to download their data
*/
module.exports = {
  '/read/user-data': {
    methods: ['get'],
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

      // get every document belonging to user
      db.find({
        selector: {
          user: req.user._id,
        },
      })
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            console.log(err);
            res.send('error');
          });
    },
  },
};
