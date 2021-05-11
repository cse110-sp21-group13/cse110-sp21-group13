const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));
const db = new PouchDB("db");

// Send in a valid json containing just the id and get back the document's json
module.exports = {
    "/read/bullet": {
        methods: ["get"],
        fn: function(req, res, next) {
            db.get(req.body.id)
            .then((response) => {res.send(response);})
            .catch((err) => {
                console.log(err);
                res.send("error");
            });
        }
    }
}
