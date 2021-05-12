const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const bcrypt = require('bcrypt');
const authenticate = require(_base + 'middleware/authenticate');

// Update a user's data
// Request json must be in the form:
// {
// "username": "User's username (primary index)",
// "updateField": {"customFieldToUpdate": "customDataToUpdate"}
// }
module.exports = {
  '/update/user': {
    methods: ['post'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      if (!req.body.updateField) {
        throw new Error('MISSING UPDATE DATA');
      }
      db.get(req.body.username)
        .then((response) => {
          bcrypt.hash(req.body.updateField.password, _saltRounds, function(err, hash) {
            if(err) {
              console.log(err);
              res.send('error');
            }
            // Replace fields of the response document
            response['_id'] = req.body.username;
            response['password'] = hash;
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
        });
    },
  },
};