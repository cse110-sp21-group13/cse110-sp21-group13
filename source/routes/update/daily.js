const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('daily');

// Update a bullet's data
// Request json must be in the form:
// {"id": "documentID", "updateField": {"customFieldToUpdate": "customDataToUpdate"}}
module.exports = {
    '/update/daily': {
        methods: ['post'],
        fn: function(req, res, next) {
            if(!req.body.updateField){
                throw new Error("MISSING UPDATE DATA");
            }
            db.get(req.body.id)
            .then((response) => {
                // Create a new JSON object with all original document values
                let originalFields = ["_id", "_rev", "user", "date","monthKey", "bullets"];
                let jsonDoc = {};
                originalFields.forEach((jsonField, index)=>{
                    jsonDoc[jsonField] = response[jsonField];
                });
                console.log(jsonDoc);

                // Replace fields based on fields in updateField
                console.log(req.body.updateField);
                for(const updatedField in req.body.updateField){
                    jsonDoc[updatedField] = req.body.updateField[updatedField];
                };
                console.log(jsonDoc);
                
                // Put newly updated document into the databse
                db.put(jsonDoc)
                .then(() => {
                    res.send("success")
                })
                .catch((err) => {
                    console.log(err);
                    res.send("error");
                });
            })
            .catch((err) => {
                console.log(err);
                res.send("error");
            });
        }
    }
}