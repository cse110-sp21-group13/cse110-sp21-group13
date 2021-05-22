const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Update a bullet's data
// Request json must be in the form:
// {
// "_id": "documentID",
// "updateField": {"customFieldToUpdate": "customDataToUpdate"}
// }
module.exports = {
  '/update/bullet': {
    methods: ['post'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      if (!req.body.updateField) {
        throw new Error('MISSING UPDATE DATA');
      }
      db.find({
        selector: {
          _id: req.body._id,
          user: req.user._id,
          docType: 'bullet',
        },
        limit: 1,
      })
          .then((response) => {
            // Replace fields of the response document
            for (const updatedField in req.body.updateField) {
              if (updatedField in response.docs[0]) {
                response.docs[0][updatedField] =
                  req.body.updateField[updatedField];
              } else {
                throw new Error('INVALID FIELD SPECIFIED');
              }
            }
            // Put newly updated document into the databse
            db.put(response.docs[0])
                .then(() => {
                  res.send('success');
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
