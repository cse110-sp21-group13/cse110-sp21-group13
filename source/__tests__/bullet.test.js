const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../start');
const server = require('../start');
const request = require('supertest');
const authenticatedUser = request.agent(app);

describe('User REST API Unit Test', function() {
  const firstUser = {
    'username': 'user1',
    'password': 'pass1',
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
          expect(res.body.id).to.equal('user1');
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

  const bulletPostDoc = {
    parentDocId: '',
    signifier: ' ',
    bulletType: '•',
    content: 'Text 1',
    completed: 'false',
    date: '2021-5-20',
    parentBulId: 'None',
  };
  // create daily for bullets
  it('Test 3: create a daily for bullets', function(done) {
    authenticatedUser
        .post('/create/daily')
        .set('Content-Type', 'application/json')
        .send(newDay)
        .end(function(err, res) {
          bulletPostDoc.parentDocId = res.body.id;
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });

  // create a bullet
  it('Test 4: create a new bullet', function(done) {
    authenticatedUser
        .post('/create/daily')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(bulletPostDoc))
        .end(function(err, res) {
          bulletUpdateDoc._id = res.body.id;
          bulletDeleteDoc._id = res.body.id;
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });

  // read newly created bullet
  /* it('Test 5: read created bullet', function(done) {
    authenticatedUser
        .get('/read/bullet')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(bulletRead))
        .end(function(err, res) {
          console.log(`[READ] ${JSON.stringify(res)}\n[BODY] ${JSON.stringify(res.body)}`);
          done();
        });
  }); */

  // update bullet
  const bulletUpdateDoc = {
    _id: '',
    updateField: {completed: true},
  };
  it('Test 6: update bullet', function(done) {
    authenticatedUser
        .post('/update/bullet')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(bulletUpdateDoc))
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });

  // delete bullet
  const bulletDeleteDoc = {
    _id: '',
  };
  it('Test 7: delete bullet', function(done) {
    authenticatedUser
        .delete('/delete/bullet')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(bulletUpdateDoc))
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.ok).to.equal(true);
          done();
        });
  });

  // so that next time run test 1 will not cause error due to duplicate username
  it('Test 8: delete current user', function(done) {
    authenticatedUser
        .delete('/delete/user')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.text).to.equal('success');
          expect(res.status).to.equal(200);
          done();
        });
  });

  afterAll(() => {
    server.close();
  });
});
