const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

/* *
Delete month page json object and all bullet documents in that month page.
*/
module.exports = {
    '/delete/month': {
        methods: ["delete"],
        fn: function(req, res, next) {
            //get month page by id
            db.get(req.body._id)
            .then((response) => {
                //access all bullet documents' id
                response.bullets.forEach((bullet, index) => {
                    db.get(bullet)
                    .then(function(doc){
                        //delete bullet document
                        return db.remove(doc._id, doc._rev);
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send("error");
                    });
                })
                //delete month page
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
