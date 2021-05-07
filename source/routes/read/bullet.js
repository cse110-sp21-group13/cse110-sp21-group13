const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('bullet-journal');

// Send in a valid document ID and get back the response document
module.exports = {
    '/read/bullet': {
        methods: ['get'],
        fn: function(req, res, next) {
            console.log(req.body.id);
            db.get(req.body.id)
            .then((response) => {res.send(response);})
            .catch((err) => {console.log(err)});
        }
    }
}