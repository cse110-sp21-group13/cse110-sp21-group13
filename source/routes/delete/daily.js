const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

// Send in a valid json containing just the id and it will be expunged from the database
module.exports = {
    '/delete/daily': {
        methods: ['delete'],
        fn: function(req, res, next) {

            db.get(req.body.id)

            .then((response) => {
                db.remove(response._id, response._rev);
                res.send("success");
            })
            .catch((err) => {
                console.log(err);
                res.send("error");
            });
        }
    }
}