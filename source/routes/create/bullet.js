const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

// Send in json form of the bullet and it gets sent to the database
module.exports = {
    '/create/bullet': {
        methods: ['post'],
        fn: function(req, res, next) {
            // Check if every field exists, if not, throw error
            let requiredFields = ["parentDocId", "user", "signifier", "bulletType", "content", "date"];
            requiredFields.forEach((jsonField, index)=>{
                if(!req.body[jsonField]){
                    throw new Error('MISSING FIELD');
                }
            });

            db.post({
                // Stores the user associated with the bullet
                user: req.body.user,
                // Stores the type of document, in this case guaranteed bullet
                docType: "bullet",
                // Stores the signifier (!, ? etc.)
                signifier: req.body.signifier,
                // Stores the type of bullet (task, event, note)
                bulletType: req.body.bulletType,
                // Stores the main content of the bullet
                content: req.body.content,
                // Stores the date the bullet was created
                date: req.body.date
            })
            .then((response) => {
                // Get parent document (monthly/daily) from provided parent ID
                db.get(req.body.parentDocId)
                .then((response) => {
                    response.bullets.push(response.id)
                })
                .catch((err) => {
                    console.log(err);
                    res.send("error");
                });
                console.log(response);
                res.send(response);
            })
            .catch((err) => {
                console.log(err);
                res.send("error");
            });

        }

        }
    }
}