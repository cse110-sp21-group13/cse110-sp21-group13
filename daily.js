const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('daily');

/*
Send in json form of the bullet and it gets sent to the database

The daily entry db will be of form: 
{
    "user": "dave",
    "date": "2021-05-09",
    "monthKey": "05-09",
    "bullets": [
        {
            "signifier": "...",
            "bullet": "...",
            "content": "..."
        },
        {
            "signifier": "...",
            "bullet": "...",
            "content": "..."
        }
    ]
}
*/
module.exports = {
    '/create/daily': {
        methods: ['post'],
        fn: function(req, res, next) {
            // Check if every field exists, if not, throw error
            let requiredFields = ["user", "date", "monthKey", "bullets"];
            requiredFields.forEach((jsonField, index)=>{
                if(!req.body[jsonField]){
                    throw new Error('MISSING FIELD');
                }
            });
            db.post({
                // Stores the user associated with the daily entry
                user: req.body.user,
                // Stores the date the daily entry was created
                date: req.body.date,
                // Stores the bullets in an array
                bullets: req.body.bullets,
                //store a corresponding monthly-key
                monthKey: req.body.monthKey
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