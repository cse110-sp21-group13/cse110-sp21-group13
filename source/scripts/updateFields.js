const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

/**
 *
 * @param {res} res The response by which to send back the results of
 * the operation.
 * @param {*} req The request that contains the data to update the
 * field.
 * 
 * Valid update fields passed in the body are of the form:
 * "updateField":{"key1": "value1", "key2": "value2"}
 */
function updateFields(res, req) {
  db.get(req.body._id)
      .then((response) => {
        // Iterate through the provided update fields in the request body
        // and set them to the new value in the update field
        for (const updatedField in req.body.updateField) {
          if (updatedField in response) {
            response[updatedField] = req.body.updateField[updatedField];
          } else {
            // Throw an error if this fails; will error if a field that
            // does not exist attempts to be updated
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
