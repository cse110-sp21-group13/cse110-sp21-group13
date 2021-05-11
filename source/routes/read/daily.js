const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

// Send in a valid json containing just the id and get back the document's json
module.exports = {
    '/read/daily': {
        methods: ['get'],
        fn: function (req, res, next) {
            db.get(req.body.id)
                .then((response) => {
                    for (let i in response.bullets) {
                        let lastBulletId = response.bullets[response.bullets.length - 1];
                        console.log(i + " index of bullets ");
                        let id = response.bullets[i];
                        console.log(id);
                        db.get(id)
                            .then((bulletResponse) => {
                                //replace id in "bullets" with the json object of that bullet
                                response.bullets[i] = bulletResponse;
                                console.log(lastBulletId + " equal to " + bulletResponse._id + " from " + bulletResponse);
                                if (lastBulletId == bulletResponse._id) {
                                    res.send(response);
                                }
                            })
                            .catch((err) => {
                                if(err){
                                    response.bullets.splice(i, 1);
                                    db.put(response)
                                    .then(() => {})
                                    .catch((err) => {
                                        console.log(err);
                                        console.log(3);
                                    });
                                    i--;
                                    console.log(response.bullets.length + "equal to ");
                                    if(id == lastBulletId){
                                        res.send(response);
                                    }
                                }
                                console.log(err);
                                console.log("2");
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.send("error");
                });
        }
    }
}