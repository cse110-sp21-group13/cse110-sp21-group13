const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Update a bullet's data
// Request json must be in the form:
// {
// "id": "documentID",
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
      db.get(req.body.id)
          .then((response) => {
            // Replace fields of the response document
            for (const updatedField in req.body.updateField) {
              if (updatedField in response) {
                response[updatedField] = req.body.updateField[updatedField];
              } else {
                throw new Error('INVALID FIELD SPECIFIED');
              }
            }
            // Put newly updated document into the databse
            db.put(response)
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
