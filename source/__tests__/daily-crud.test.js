const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const {app, server} = require('../start');
const request = require('supertest');
const authenticatedUser = request.agent(app);

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

describe('User REST API Unit Test', function() {
  const firstUser = {
    'username': 'cameron2',
    'password': '123456',
  };

  const newDay = {
    'day': '20',
    'month': '2021-5',
    'bullets': [],
  };

  it('Test 1: create a valid user', function(done) {
    authenticatedUser
        .post('/create/user')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(firstUser.username);
          user = firstUser.username;
          done();
        });
  }, 30000);

  // log in/ create the session
  it('Test 2: create a session for the user', function(done) {
    authenticatedUser
        .post('/create/session')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(302);
          expect(res.text).to.equal('Found. Redirecting to session/success');
          done();
        });
  });

  // new daily creation
  it('Test 3: create a daily', function(done) {
    authenticatedUser
        .post('/create/daily')
        .set('Content-Type', 'application/json')
        .send(newDay)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });


  const delJSON = {
    '_id': '',
  };


  // get daily
  it('Test 4: get the day', function(done) {
    authenticatedUser
        .get('/read/daily/' + newDay.month + '/' + newDay.day)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          delJSON._id = res.body._id;
          expect(res.body.user).to.equal(user);
          expect(res.body.docType).to.equal('daily');
          done();
        });
  });

  // delete daily
  it('Test 5: delete daily', function(done) {
    authenticatedUser
        .delete('/delete/daily')
        .set('Content-Type', 'application/json')
        .send(delJSON)
        .end(function(err, res) {
          expect(res.text).to.equal('success');
          done();
        });
  });

  // attempt to delete same daily should fail and reponse should be error
  it('Test 6: delete same daily again', function(done) {
    authenticatedUser
        .delete('/delete/daily')
        .set('Content-Type', 'application/json')
        .send(delJSON)
        .end(function(err, res) {
          expect(res.text).to.equal('error');
          done();
        });
  });


  const updateDailyJSON = {
    '_id': '',
    'updateField': {
      'day': '10',
      'month': '2021-12',
      'bullets': [],
    },
  };

  // new daily creation
  it('Test 7: create a daily', function(done) {
    authenticatedUser
        .post('/create/daily')
        .set('Content-Type', 'application/json')
        .send(newDay)
        .end(function(err, res) {
          updateDailyJSON._id = res.body._id;
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });

  // get new daily
  it('Test 4: get the day', function(done) {
    authenticatedUser
        .get('/read/daily/' + newDay.month + '/' + newDay.day)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body.month).to.equal('2021-5');
          expect(res.body.day).to.equal('20');
          expect(res.body.user).to.equal(user);
          expect(res.body.docType).to.equal('daily');
          done();
        });
  });

  // update daily
  it('Test 8: update daily', function(done) {
    authenticatedUser
        .post('/update/daily')
        .set('Content-Type', 'application/json')
        .send(updateDailyJSON)
        .end(function(err, res) {
          expect(res.text).to.equal('success');
          done();
        });
  });


  // get updated daily
  it('Test 9: get the new day', function(done) {
    authenticatedUser
        .get('/read/daily/' + updateDailyJSON.updateField.month +
              '/' + updateDailyJSON.updateField.day)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body.month).to.equal('2021-12');
          expect(res.body.day).to.equal('10');
          expect(res.body.user).to.equal(user);
          expect(res.body.docType).to.equal('daily');
          done();
        });
  });

  afterAll(async (done) => {
    server.close();
    await db.destroy();
  });
});
