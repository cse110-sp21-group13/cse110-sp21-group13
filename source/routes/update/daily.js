const PouchDB = require("pouchdb");
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB("db");

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
        fn: function(req, res, next) {
            //If the update request does not in form specified above, throw error
            if(!req.body.updateField){
                throw new Error("MISSING UPDATE DATA");
            }
            //get which daily doc the request want to update.
            db.get(req.body._id)
            .then((response) => {
                //update every specified field.
                for(const updatedField in req.body.updateField){
                    if(updatedField in response){
                        response[updatedField] = req.body.updateField[updatedField];
                    }
                    else{
                        throw new Error("INVALID FIELD SPECIFIED");
                    }
                };
                // Put newly updated document into the databse
                db.put(response)
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
