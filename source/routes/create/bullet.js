const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('bullet-journal');

module.exports = {
    '/create/bullet': {
        methods: ['post'],
        fn: function(req, res, next) {
            db.post({
                user: req.body.user,
                type: req.body.type,
                signifier: req.body.signifier,
                bulletType: req.body.bulletType,
                content: req.body.content,
                date: req.body.date
            })
            .then((result) => {console.log(result)})
            .catch((err) => {console.log(err)});

            res.send('success');
        }
    }
}