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
            // Get parent document (monthly/daily) from provided bullet date
            date = response.docs[0].date.split('-');
            db.find({
              selector: {
                day: date[2],
                month: date[0]+'-'+date[1],
                user: req.user._id,
                docType: 'daily',
              },
              limit: 1,
            })
                .then((parentResponse) => {
                  // Remove the bullet ID from the parent document
                  const index = parentResponse.docs[0]
                      .bullets.indexOf(response._id);
                  parentResponse.docs[0].bullets.splice(index);
                  // Update the modified parent
                  db.put(parentResponse.docs[0])
                      .then(() => {})
                      .catch((err) => {
                        console.log(err);
                      });
                })
                .then(() =>{
                  db.remove(response.docs[0]._id, response.docs[0]._rev);
                  res.send('success');
                })
                .catch((err) => {
                  console.log(err);
                  res.send('error');
                });
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
                  res.send('error');
                });
          })
          .catch((err) => {
            console.log(err);
            res.send('error');
          });
    },
  },
};
