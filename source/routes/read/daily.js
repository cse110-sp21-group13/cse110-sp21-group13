const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

/* *
read daily will send response with form
{
    "date": "2021-05-09",
    "bullets": [
        {bullet1 json object},
        {bullet2 json object}
    ]
}
*/
module.exports = {
  '/read/daily/:month/:day': {
    methods: ['get'],
    middleware: [authenticate],
    fn: function(req, res, next) {
      let tempArr = [];
      // get Daily entry documnet by id
      db.find({
        selector: {
          day: req.params.day,
          month: req.params.month,
          user: req.user._id,
          docType: 'daily',
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
                  docType: 'bullet',
                },
                limit: 1,
              })
                  .then((bulletResponse) => {
                    if (bulletResponse.docs[0] != 'undefined') {
                      tempArr[index] = bulletResponse.docs[0];
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    res.send('error');
                  })
                  .finally(()=>{
                    curr++;
                    if (curr >= array.length) {
                      // Remove unassigned indicies from being sent
                      tempArr = tempArr.filter(function(arr) {
                        return arr !== undefined;
                      });
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
