const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

/* *
Delete daily entry json object and all bullet documents in that daily entry.
*/
module.exports = {
  '/delete/daily': {
    methods: ['delete'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      // get daily entry by id
      db.get(req.body._id)
          .then((response) => {
            // access all bullet documents' id
            response.bullets.forEach((bullet, index) => {
              db.get(bullet)
                  .then(function(doc) {
                    // delete bullet document
                    return db.remove(doc._id, doc._rev);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.send('error');
                  });
            });
            // delete daily entry
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
