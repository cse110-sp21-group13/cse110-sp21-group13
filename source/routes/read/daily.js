const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

// Send in a valid json containing just the id and get back the document's json
module.exports = {
    '/read/daily': {
        methods: ['get'],
        fn: function (req, res, next) {
            var tempBullets =[];
            db.get(req.body.id)
                .then((response) => {
                    //let i = 0;
                    //var tempBullets = [];
                    //var i;
                    //for(var i = 0; i < response.bullets.length; i++){
                    response.bullets.forEach((bullet,index,array) => {
                        
                        let lastBulletId = response.bullets[response.bullets.length - 1];
                        //let id = response.bullets[i];
                        let id = array[index];
                        console.log(index + " index of bullet ");
                        db.get(bullet)
                            .then((bulletResponse) => {
                                //replace id in "bullets" with the json object of that bullet
                                //response.bullets[i] = bulletResponse;
                            
                                tempBullets.push(bulletResponse);
                                console.log(tempBullets);
                                //bullet=bulletResponse;
                                array[array.indexOf(bullet)]=bulletResponse;
                                
                                console.log(lastBulletId + " equal to " + bulletResponse._id + " 1 ");
                                if (lastBulletId == bulletResponse._id) {
                                    //res.send(tempResponse);
                                    res.send(response);
                                }
                            
                            })
                            .catch((err) => {
                                if(err){
                                    //tempResponse.bullets.splice(i, 1);
                                    array.splice(index,1);
                                    //index--;
                                    db.put(response)
                                    .then(() => {})
                                    .catch((err) => {
                                        console.log(err);
                                        console.log(3);
                                    });
                                    console.log(response.bullets);
                                    //i--;
                                    //console.log(i);
                                    console.log(response.bullets.length + " array length ");
                                    console.log(tempBullets);
                                    console.log("second time");
                                    console.log(lastBulletId + " equal to " + bullet + " 2 ");
                                    if(bullet == lastBulletId){
                                        //res.send(tempResponse);
                                       // response.bullets = tempBullets;
                                        res.send(response);
                                    }
                                }
                                console.log(err);
                                console.log("2");
                            });
                    });
                
                    //console.log(response.bullets);
                })
                .catch((err) => {
                    console.log(err);
                    res.send("error");
                });
        }
    }
}