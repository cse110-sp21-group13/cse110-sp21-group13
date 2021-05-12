const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
/* *
read daily will send response with form 
{
    "user": "dave",
    "date": "2021-05-09",
    "monthKey": "05-09",
    "bullets": [
        {bullet1 json objectt},
        {bullet2 json object}
    ]
}
*/
module.exports = {
    '/read/daily': {
        methods: ['get'],
        fn: function (req, res, next) {
            let tempArr = [];
            //get Daily entry documnet by id
            var tempResponse;
            db.get(req.body._id)
            .then(response => {
                //get into the bullets array inside daily entry
                let curr = 0;
                response.bullets.forEach((bullet, index, array) => {
                    console.log("Array length is "+ array.length);
                    let lastBulletId = response.bullets[response.bullets.length - 1];
                    console.log("Incrementing curr from "+ curr +" to" + curr+1 + " for id "+bullet);
                    //get bullet document by id
                    db.get(bullet)
                    .then((bulletResponse) => {
                        //Replace bullet id by bullet Json object
                        //array[index] = bulletResponse;
                        tempArr.push(bulletResponse);
                        //If reach the final bullet, send out the updated response
                        /*if (lastBulletId == bulletResponse._id) {
                            res.send(response);
                        }*/

                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(()=>{
                        curr++;
                        console.log(curr + " >= " + array.length);
                        if (curr >= array.length) {
                            console.log(response);
                            response.bullets=tempArr;
                            res.send(response);
                            return;
                        }
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
}