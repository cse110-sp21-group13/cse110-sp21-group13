const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
/* *
read month will send response with form 
{
    "user": "dave",
    "month": "May",
    "bullets": [
        {bullet1 json objectt},
        {bullet2 json object}
    ],
    "daillys":[
        {"date": "...", "daily": "..."}
    ]
}
*/
module.exports = {
    '/read/month': {
        methods: ['get'],
        fn: function (req, res, next) {

            let tempArr = [];

            //create index for query
            db.createIndex({
                index: {
                    fields: ['user']
                }
            }).then((result) => {
                console.log(result);
            }).catch((err) => {
                res.send("error");
            });

            //get month page by id
            db.get(req.body._id)
            .then((response) => {
                //handle edge case: nothing inside the bullets
                if(response.bullets.length == 0){
                    //grab all daily journal entries in that month
                    db.find({
                        selector: {
                            user: response.user,
                            monthKey: response.month,
                            docType: "dailyJournal"
                        },
                        fields: ["date", '_id']
                    })
                    .then((result) => {
                        response.dailys = result;
                        res.send(response);
                    })
                }

                let curr = 0;
                //get inside the bullets array
                response.bullets.forEach((bullet, index, array) => {
                    //get bullet document by id
                    db.get(bullet)
                    .then((bulletResponse) => {
                        tempArr.push(bulletResponse);
                    })
                    .catch((err) => {
                        res.send("error");
                    })
                    .finally(() => {
                        //send out bullets and all daily journal entries
                        curr++;
                        if (curr >= array.length) {
                            response.bullets = tempArr;
                            db.find({
                                selector: {
                                    user: response.user,
                                    monthKey: response.month,
                                    docType: "dailyJournal"
                                },
                                fields: ['date', '_id']
                            })
                            .then((result) => {
                                response.dailys = result;
                                //send out the response
                                res.send(response);
                            })
                            return;
                        }
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                res.send("error");
            });
        }
    }
}
