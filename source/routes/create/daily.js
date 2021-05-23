const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

/*
Send in json form of the bullet and it gets sent to the database

The daily entry db will be of form:
{
    "date": "2021-05-09",
    "bullets": ["bullet-id1", "bullet-id2", ...]
}
*/
module.exports = {
  '/create/daily': {
    methods: ['post'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      // Check if every field exists, if not, throw error
      const requiredFields = ['date', 'monthKey', 'bullets'];
      requiredFields.forEach((jsonField, index) => {
        if (!req.body[jsonField]) {
          throw new Error('MISSING FIELD');
        }
      });
      db.post({
        // Stores the user associated with the daily entry
        user: req.user._id,
        // Stores the date the daily entry was created
        date: req.body.date,
        // Stores the docType of the daily entry
        docType: 'daily',
        // Stores the YYYY/MM; used for month's batch reads of daily
        monthKey: req.body.monthKey,
        // Stores the bullets in an array
        bullets: req.body.bullets,
      })
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            console.log(err);
            res.send('error');
          });
    },
  },
};
