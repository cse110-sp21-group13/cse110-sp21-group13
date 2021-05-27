const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const baseUrl = 'localhost:3001/';
chai.use(chaiHttp);

const app = require('../start');
const request = require('supertest');
const authenticatedUser = request.agent(app);

describe('User REST API Unit Test', function() {
  const firstUser = {
    'username': 'user1',
    'password': 'pass1',
  };

  it('Test 1: create a valid user', function(done) {
    authenticatedUser
        .post('/create/user')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(user1);
          done();
        });
  }, 10000);

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
});
