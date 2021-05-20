const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const authenticate = require(_base + 'middleware/authenticate');
const genericUpdater = require(_base + 'scripts/update_fields');

/* *
 Update a month page's data
 Request json must be in the form:
 {
    "_id": "documentID",
    "updateField": {
        "customFieldToUpdate": "customDataToUpdate",

    }
}
*/
module.exports = {
  '/update/month': {
    methods: ['post'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      genericUpdater.updateFields(res, req);
    },
  },
};
