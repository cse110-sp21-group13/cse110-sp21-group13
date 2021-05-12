const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
/* *
read month will send response with form 
{
    "user": "dave",
    "date": "2021-05-09",
    "bullets": [
        {bullet1 json objectt},
        {bullet2 json object}
    ]
}
*/
module.exports = {
    '/read/month': {
        methods: ['get'],
        fn: function (req, res, next) {
            //get month page documnet by id
            db.get(req.body._id)
            .then((response) => {
                //get into the bullets array inside daily entry
                response.bullets.forEach((bullet, index, array) => {
                    let lastBulletId = response.bullets[response.bullets.length - 1];
                    //get bullet document by id
                    db.get(bullet)
                    .then((bulletResponse) => {
                        //Replace bullet id by bullet Json object
                        array[index] = bulletResponse;
                        //If reach the final bullet, send out the updated response
                        if (lastBulletId == bulletResponse._id) {
                            res.send(response);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send("error caused by cannot find bullet document");
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                res.send("error caused by cannot find daily document by ID");
            });
        }
    }
}