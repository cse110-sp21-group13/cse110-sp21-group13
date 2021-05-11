const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

/**
 * Updates the fields of a PouchdDB document
 * @param {response} res The response to send back with
 * @param {request} req The request sent to the document
 */
function updateFields(res, req) {
  db.get(req.body._id)
      .then((response) => {
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
}
module.exports={updateFields};
