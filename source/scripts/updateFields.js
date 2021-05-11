const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');


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
module.exports={updateFields}