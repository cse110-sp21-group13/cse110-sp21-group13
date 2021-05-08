const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

// Send in json form of the bullet and it gets sent to the database
module.exports = {
    '/create/bullet': {
        methods: ['post'],
        fn: function(req, res, next) {
            // Check if every field exists, if not, throw error
            let requiredFields = ["user", "type", "signifier", "bulletType", "content", "date"];
            requiredFields.forEach((jsonField, index)=>{
                if(!req.body[jsonField]){
                    throw new Error('MISSING FIELD');
                }
            });
            db.post({
                user: req.body.user,
                type: req.body.type,
                signifier: req.body.signifier,
                bulletType: req.body.bulletType,
                content: req.body.content,
                date: req.body.date
            })
            .then((response) => {
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