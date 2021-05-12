const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

// Send in a valid json containing just the id and get back the document's json
/*module.exports = {
    '/read/daily': {
        methods: ['get'],
        fn:function(req, res, next){
            // Purge the bullet list of invalid/deleted bullets
            db.get(req.body.id)
            .then((response)=>{
                response.bullets.forEach((bullet, index, array) => {
                    db.get(bullet)
                    .then(() => {})
                    .catch((err) => {
                        console.log("first array:" + array);
                        array.splice(index, 1);
                        console.log(array);
                        console.log(response);
                        db.put(response)
                        .then(() => {})
                        .catch(() => {});
                    });
                })
            })
            .then(() => {console.log("Finished pruning")})
            .catch((err) => {
                res.send('error');
            });
            console.log("Began dailyResponse");
            var dailyResponse = {};
            let sent = false;
            db.get(req.body.id)
            .then((response) => {
                dailyResponse = response;
                if(dailyResponse.bullets.length == 0){
                    res.send(dailyResponse);
                    sent = true;
                }
                dailyResponse.bullets.forEach((bullet, index, array) => {
                    console.log(dailyResponse.bullets.length);
                    const lastBulletId = dailyResponse.bullets[dailyResponse.bullets.length - 1];
                    db.get(bullet)
                    .then((bulletResponse) => {
                        dailyResponse.bullets[index] = bulletResponse;
                        console.log(bullet + " and " + lastBulletId);
                        /*if(bullet == lastBulletId){
                            res.send(dailyResponse);
                            sent = true;
                        }
                    })
                    .then(()=>{
                        if(bullet == lastBulletId){
                            res.send(dailyResponse);
                            //sent = true;
                        }
                    })
                    .catch((err) =>{
                        console.log(err);
                        
                    });
                })
                
            });
            .then(() => {
                if(sent == false){
                    res.send(dailyResponse);
                }
            });
            
        }
    },
};*/

/*
module.exports = {
    '/read/daily': {
        methods: ['get'],
        fn:async function(req, res, next){
            try{
                var dailyResponse = await db.get(req.body.id);
                for (const bullet of dailyResponse.bullets){
                    try{
                        let bulletResponse = await db.get(bullet);
                        dailyResponse.bullets[bullet] = bulletResponse;
                        console.log(dailyResponse);
                    }
                    catch(err){
                        console.log(err);
                        let index = dailyResponse.bullets.indexOf(bullet);
                        dailyResponse.bullets.splice(index, 1);
                    }
                }
                await db.put(dailyResponse);
                res.send(dailyResponse);

            }
            catch(err){
                console.log(err);
                res.send('error');
            }
        }
    },
};*/
/*
function sendResponse(response, res){
    // Update db with cleaned array
    if(response){

    }
}*/
/*  '/read/daily': {
        methods: ['get'],
        fn: function (req, res, next) {
            db.get(req.body.id)
                .then((response) => {
                    //let dailyResponse = response;
                    response.bullets.push("lastElement");
                    response.bullets.forEach((bullet,index,array) => {
                        let lastBulletId = response.bullets[response.bullets.length - 1];
                        if(bullet == "lastElement"){
                            response.bullets.pop();
                            //res.send(response);
                        }
                        db.get(bullet)
                            .then((bulletResponse) => {
                                array[array.indexOf(bullet)]=bulletResponse;
                                                               
                                //console.log(lastBulletId + " equal to " + bulletResponse._id + " 1 ");
                                if (lastBulletId == bulletResponse._id) {
                                    //dailyResponse.bullets.pop();
                                    res.send(dailyResponse);
                                }
                            })
                            .catch((err) => {
                                if(err){
                                    array.splice(index,1);
                                    db.put(response)
                                    .then(() => {})
                                    .catch((err) => {
                                        console.log(err);
                                        console.log("3");
                                    });
                                    
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
};*/

/*module.exports = {
    '/read/daily': {
        methods: ['get'],
        fn: function (req, res, next) {
            var tempBullets =[];
            var dailyResponse;
            db.get(req.body.id)
                .then((response) => {
                    dailyResponse = response;
                    //let i = 0;
                    //var tempBullets = [];
                    //var i;
                    //for(var i = 0; i < response.bullets.length; i++){
                    dailyResponse.bullets.forEach((bullet,index,array) => {
                        let lastBulletId = dailyResponse.bullets[dailyResponse.bullets.length - 1];
                        //let id = dailyResponse.bullets[i];
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
                                }
                                console.log(err);
                                console.log("2");
                            });
                        }
                    });
                
                }).then(() => {                               
                    res.send(dailyResponse);
                })
                .catch((err) => {
                    console.log(err);
                    res.send("error");
                });
        }
    }
}

*/