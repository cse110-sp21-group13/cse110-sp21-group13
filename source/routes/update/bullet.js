<<<<<<< HEAD
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');
const updater = require('./../../scripts/updateFields.js');
=======
const updater = require('./../../scripts/updateFields.js');

>>>>>>> af80c5850f7636cfebe96bcd2fddfdea94175a95

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
      updater.updateFields(res, req);
    },
  },
};
