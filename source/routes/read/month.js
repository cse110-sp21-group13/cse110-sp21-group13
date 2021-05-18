const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');
const authenticate = require(_base + 'middleware/authenticate');

/* *
read month will send response with form
{
    "user": "dave",
    "month": "May",
    "bullets": [
        {bullet1 json object},
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
    middleware: [authenticate],
    fn: function(req, res, next) {
      const tempArr = [];

      // create index for query
      db.createIndex({
        index: {
          fields: ['user']
        },
      }).then((result) => {
        console.log(result);
      }).catch((err) => {
        res.send('error');
      });

      // get month page by id
      db.find({
        selector: {
          _id: req.body._id,
          user: req.user._id,
          docType: 'month'
        },
        limit: 1,
      })
          .then((response) => {
            // handle edge case: nothing inside the bullets
            if (response.docs[0].bullets.length == 0) {
              // grab all daily journal entries in that month
              db.find({
                selector: {
                  user: req.user._id,
                  monthKey: response.docs[0].month,
                  docType: 'daily'
                },
                fields: ['date', '_id'],
              })
              .then((result) => {
                response.dailys = result.docs;
                res.send(response);
              });
            }

            let curr = 0;
            // get inside the bullets array
            response.docs[0].bullets.forEach((bullet, index, array) => {
              // get bullet document by id
              db.find({
                selector: {
                  _id: bullet,
                  user: req.user._id
                },
                limit: 1,
              })
                  .then((bulletResponse) => {
                    tempArr.push(bulletResponse.docs[0]);
                  })
                  .catch((err) => {
                    res.send('error');
                  })
                  .finally(() => {
                    // send out bullets and all daily journal entries
                    curr++;
                    if (curr >= array.length) {
                      response.docs[0].bullets = tempArr;
                      db.find({
                        selector: {
                          user: req.user._id,
                          monthKey: response.docs[0].month,
                          docType: 'daily',
                        },
                        fields: ['date', '_id'],
                      })
                          .then((result) => {
                            response.docs[0].dailys = result;
                            // send out the response
                            res.send(response);
                          });
                      return;
                    }
                  });
            });
          })
          .catch((err) => {
            console.log(err);
            res.send('error');
          });
    },
  },
};
