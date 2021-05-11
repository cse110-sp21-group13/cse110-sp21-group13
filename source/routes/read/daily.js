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
                let lastBulletId = response.bullets[response.bullets.length-1];
                for(let i in response.bullets){
                    let id=response.bullets[i];
                    if(!response.bullets[i] instanceof String) {
                        continue;
                    }
                    //access the bullet document by its id
                    db.get(id)
                    .then((bulletResponse) => {
                        if(bulletResponse){
                            //replace id in "bullets" with the json object of that bullet
                            response.bullets[i]= bulletResponse;
                            console.log(lastBulletId +" equal to "+ bulletResponse._id + " from "+ bulletResponse);
                            if(lastBulletId == bulletResponse._id){
                                res.send(response);
                            }
                        }
                        else{
                            response.bullets.splice(i);
                        }
                    })
                    .catch((err)=>{
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