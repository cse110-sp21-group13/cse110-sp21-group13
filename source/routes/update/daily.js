const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');
const genericUpdater = require(_base + 'scripts/update_fields');

/* *
 Update a daily entry's data
 Request json must be in the form:
 {
    "_id": "documentID",
    "updateField": {
        "customFieldToUpdate": "customDataToUpdate",

    }
}
*/
module.exports = {
  '/update/daily': {
    methods: ['post'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      genericUpdater.updateFields(res, req);
    },
  },
};
