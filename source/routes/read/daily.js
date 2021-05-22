const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

/* *
read daily will send response with form
{
    "user": "dave",
    "date": "2021-05-09",
    "monthKey": "05-09",
    "bullets": [
        {bullet1 json object},
        {bullet2 json object}
    ]
}
*/
module.exports = {
  '/read/daily': {
    methods: ['get'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      const tempArr = [];
      // get Daily entry documnet by id
      db.find({
        selector: {
          date: req.body.date,
          user: req.user._id,
          docType: 'daily'
        },
        limit: 1,
      })
          .then((response) => {
            if (response.docs[0].bullets.length == 0) {
              res.send(response.docs[0]);
            }
            let curr = 0;
            // get into the bullets array inside daily entry
            response.docs[0].bullets.forEach((bullet, index, array) => {
              // get bullet document by id
              db.find({
                selector: {
                  _id: bullet,
                  user: req.user._id,
                  docType: 'bullet'
                },
                limit: 1,
              })
                  .then((bulletResponse) => {
                    tempArr.push(bulletResponse.docs[0]);
                  })
                  .catch((err) => {
                    res.send('error');
                  })
                  .finally(()=>{
                    curr++;
                    if (curr >= array.length) {
                      response.docs[0].bullets=tempArr;
                      res.send(response.docs[0]);
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
