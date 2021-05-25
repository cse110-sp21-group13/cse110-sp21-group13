const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const bcrypt = require('bcrypt');
const authenticate = require(_base + 'middleware/authenticate');

// Update a user's data
// Request json must be in the form:
// {
// "username": "User's username (primary index)",
// "updateField": { "customFieldToUpdate": "customDataToUpdate",
//                  "oldPassword": "passwd"
//                  "newPassword": "passwd1"
//                }
// }
module.exports = {
  '/update/user': {
    methods: ['post'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      if (!req.body.updateField) {
        throw new Error('MISSING UPDATE DATA');
      }
      db.get(req.user._id)
          .then((response) => {
            // TODO: attempt to update style field first
            // If the user attempts to update their password, check the old password
            if(req.body.updateField.newPassword !== undefined) {
              bcrypt.compare(req.body.updateField.oldPassword, response.password).then(
                function(isMatch) {
                if(!isMatch)
                  res.send("error: Old password doesn't match " +
                    "existing password");
                bcrypt.hash(req.body.updateField.newPassword, _saltRounds,
                    function(err, hash) {
                      if (err) {
                        console.log(err);
                        res.send('error');
                      }
                      // Replace fields of the response document
                      response['_id'] = req.user._id;
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
                });
              });
            }
          });
    },
  },
};
