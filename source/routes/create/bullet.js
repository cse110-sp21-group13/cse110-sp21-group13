const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('bullet-journal');

module.exports = {
    '/create/bullet': {
        methods: ['post'],
        fn: function(req, res, next) {
            db.post({
                signifier 
            })
            .then((result) => {console.log(result)})
            .catch((err) => {console.log(err)});

            res.send('success');
        }
    }
}