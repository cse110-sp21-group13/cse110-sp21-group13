const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

/*
Send in json form of the bullet and it gets sent to the database

The daily entry db will be of form: 
{
    "user": "dave",
    "date": "2021-05-09",
    "docType": "dailyJournal",
    "monthKey": "May",
    "bullets": ["bullet-id1", "bullet-id2", ...]
}
*/
module.exports = {
    '/create/daily': {
        methods: ['post'],
        fn: function(req, res, next) {
            // Check if every field exists, if not, throw error
            let requiredFields = ["user", "date", "docType", "monthKey", "bullets"];
            requiredFields.forEach((jsonField, index)=>{
                if(!req.body[jsonField]){
                    throw new Error("MISSING FIELD");
                }
            });
            db.post({
                // Stores the user associated with the daily entry
                user: req.body.user,
                // Stores the date the daily entry was created
                date: req.body.date,
                // Stores the docType of the daily entry
                docType: req.body.docType,
                //store a corresponding monthly-key
                monthKey: req.body.monthKey,
                // Stores the bullets in an array
                bullets: req.body.bullet
            })
            .then((response) => {
                res.send(response);
            })
            .catch((err) => {
                console.log(err);
                res.send("error");
            });
        }
    }
} 
