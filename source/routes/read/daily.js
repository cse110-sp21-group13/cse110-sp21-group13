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
    fn: function(req, res, next) {
      const tempArr = [];
      // get Daily entry documnet by id
      db.get(req.body._id)
          .then((response) => {
            if (response.bullets.length == 0) {
              res.send(response);
            }
            let curr = 0;
            // get into the bullets array inside daily entry
            response.bullets.forEach((bullet, index, array) => {
              // get bullet document by id
              db.get(bullet)
                  .then((bulletResponse) => {
                    tempArr.push(bulletResponse);
                  })
                  .catch((err) => {
                    res.send('error');
                  })
                  .finally(()=>{
                    curr++;
                    if (curr >= array.length) {
                      response.bullets=tempArr;
                      res.send(response);
                      return;
                    }
                  });
            });
          })
          .catch((err) => {
            res.send('error');
          });
    },
  },
};
