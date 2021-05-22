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
      db.find({
        selector: {
          _id: req.body._id,
          user: req.user._id,
          docType: 'daily',
        },
        limit: 1,
      })
          .then((response) => {
            // access all bullet documents' id
            response.docs[0].bullets.forEach((bullet, index) => {
              db.find({
                selector: {
                  _id: bullet,
                  user: req.user._id,
                  docType: 'bullet',
                },
                limit: 1,
              })
                  .then(function(doc) {
                    // delete bullet document
                    return db.remove(doc.docs[0]._id, doc.docs[0]._rev);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.send('error');
                  });
            });
            // delete daily entry
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
