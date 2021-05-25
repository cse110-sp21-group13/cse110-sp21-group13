const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

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
      // If the update request does not in form specified above, throw error
      if (!req.body.updateField) {
        throw new Error('MISSING UPDATE DATA');
      }
      // get which daily doc the request want to update.
      db.find({
        selector: {
          _id: req.body._id,
          user: req.user._id,
          docType: 'daily',
        },
        limit: 1,
      }).get(req.body._id)
          .then((response) => {
            // update every specified field.
            for (const updatedField in req.body.updateField) {
              if (updatedField in response.docs[0]) {
                response.docs[0][updatedField] =
                  req.body.updateField[updatedField];
              } else {
                throw new Error('INVALID FIELD SPECIFIED');
              }
            };
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
