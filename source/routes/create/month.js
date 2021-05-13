const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

/*
Send in json form of the month page and it gets sent to the database

The month page will be of form: 
{
    "user": "dave",
    "month": "May",
    "bullets": ["bullet-id1", "bullet-id2", ...]
}
*/
module.exports = {
    '/create/month': {
        methods: ['post'],
        fn: function(req, res, next) {
            // Check if every field exists, if not, throw error
            let requiredFields = ["user", "month", "bullets"];
            requiredFields.forEach((jsonField, index)=>{
                if(!req.body[jsonField]){
                    throw new Error('MISSING FIELD');
                }
            });
            db.post({
                // Stores the user associated with the month page
                user: req.body.user,
                // Stores the month the month page was created
                month: req.body.month,
                // Stores the bullets id in an array
                bullets: req.body.bullets,
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