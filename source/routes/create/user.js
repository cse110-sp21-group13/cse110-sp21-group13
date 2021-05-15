const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const bcrypt = require('bcrypt');
const authenticate = require(_base + 'middleware/authenticate');

// Send in json form of the user and it gets sent to the database
module.exports = {
  '/create/user': {
    methods: ['post'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      // Check if every field exists, if not, throw error
      const requiredFields = ['username', 'password'];

      requiredFields.forEach((jsonField, index) => {
        if (!req.body[jsonField]) {
          throw new Error('MISSING FIELD');
        }
      });

      bcrypt.hash(req.body.password, _saltRounds, function(err, hash) {
        db.post({
          // Stores the username
          _id: req.body.username,
          // Stores the type of document, in this case guaranteed user
          docType: 'user',
          // Stores the hashed password
          password: hash,
        }).then((response) => {
          res.send(response);
        }).catch((err) => {
          res.send('error');
        });
      });
    },
  },
};
