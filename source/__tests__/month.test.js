const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const {app, server} = require('../start');
const request = require('supertest');
const authenticatedUser = request.agent(app);
const db = new PouchDB('db');

describe('User REST API Unit Test', function() {
  let user;
  const firstUser = {
    'username': 'non10',
    'password': '2333',
  };
  user = firstUser.username;

  const newMonth = {
    'month': '2021-5',
    'bullets': [],
  };
  it('Test 0: create a valid user', function(done) {
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
  });
  it('Test 1: create a session for the user', function(done) {
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


  it('Test 2: create a Month', function(done) {
    authenticatedUser
        .post('/create/month')
        .set('Content-Type', 'application/json')
        .send(newMonth)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });
  const delJSON = {
    '_id': '',
  };
  it('Test 3: get the current month', function(done) {
    authenticatedUser
        .get('/read/month/' + newMonth.month + '/')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body.user).to.equal(user);
          expect(res.body.docType).to.equal('month');
          expect(res.body.month).to.equal(newMonth.month);
          done();
        });
  });

  const updateMonth={

    '_id': '',
    'updateField': {
      'month': '2021-4',
      'bullets': [],
    },

  };

  it('Test 4: update month', function(done) {
    authenticatedUser
        .post('/update/month')
        .set('Content-Type', 'application/json')
        .send(updateMonth)
        .end(function(err, res) {
          expect(res.text).to.equal('success');
          done();
        });
  });

  it('Test 5: get the new month', function(done) {
    authenticatedUser
        .get('/read/month/' + updateMonth.updateField.month + '/')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body.month).to.equal(updateMonth.updateField.month);
          expect(res.body.user).to.equal(user);
          expect(res.body.docType).to.equal('month');
          done();
        });
  });

  const newDay = {
    'day': '20',
    'month': '2021-4',
    'bullets': [],
  };
  it('Test 6: create a daily', function(done) {
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

  it('Test 7: reads daily from month', function(done) {
    authenticatedUser
        .get('/read/month/' + newDay.month + '/')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body.user).to.equal(user);
          expect(res.body.docType).to.equal('month');
          expect(res.body.dailys).not.to.equal(null);
          done();
        });
  });
  it('Test 8: delete month', function(done) {
    authenticatedUser
        .delete('/delete/month')
        .set('Content-Type', 'application/json')
        .send(delJSON)
        .end(function(err, res) {
          expect(res.text).to.equal('success');
          done();
        });
  });

  it('Test 9: delete same month again', function(done) {
    authenticatedUser
        .delete('/delete/month')
        .set('Content-Type', 'application/json')
        .send(delJSON)
        .end(function(err, res) {
          expect(res.text).to.equal('error');
          done();
        });
  });

  afterAll(async () => {
    server.close();
    await db.destroy();
  });
});
