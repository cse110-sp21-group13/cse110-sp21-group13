const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

// Send in a valid json containing just the id and get back the document's json
module.exports = {
    '/read/daily': {
        methods: ['get'],
        fn: function(req, res, next) {
            db.get(req.body.id)
            .then((response) => {
                for(var i in response.bullets){
                    if(!response.bullets[i] instanceof String) {
                        continue;
                    }
                    db.get(response.bullets[i])
                    .then((bulletResponse) => {
                        response.bullets[i]= bulletResponse;

                        db.put(response)
                        .then(()=>{})
                        .catch((err)=>{
                            console.log(err);
                        });
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                    
                };
                /*response.bullets.forEach((bullet,index) => {
                    db.get(bullet)
                    .then((bulletResponse) => {
                        bullet=bulletResponse;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                });*/
                res.send(response);
            })
            .catch((err) => {
                console.log(err);
                res.send("error");
            });
        }
    }
}