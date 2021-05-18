const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

// Send in a valid json containing just the id and get back the document's json
// Request json must be in the form:
// {
// "_id": "the ID of the document to retrieve",
// }
module.exports = {
  '/read/bullet': {
    methods: ['get'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      db.find({
        selector: {
          _id: req.body._id,
          user: req.user._id,
          docType: 'bullet'
        },
        limit: 1,
      }).then((response) => {
        res.send(response.docs[0]); // Return if we have a match
      }).catch((err) => {
        console.log(err);
        res.send('error');
      });
    },
  },
};
