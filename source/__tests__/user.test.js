const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../start');
const server = require('../start');
const request = require('supertest');
const authenticatedUser = request.agent(app);

describe('User REST API Unit Test', function() {
  let user;
  const firstUser = {
    'username': 'non9',
    'password': '2233',
  };
  user = firstUser.username;

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
  });

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

  // Get the user of current session
  it('Test 3: get the current user', function(done) {
    authenticatedUser
        .get('/read/user')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body.username).to.equal(user);
          expect(res.body.docType).to.equal('user');
          done();
        });
  });

  const updateUser = {
    'username': 'non9',
    'updateField': {
      'oldPassword': '2233',
      'newPassword': '1234',
    },
  };
  it('Test 4: update the current user password', function(done) {
    authenticatedUser
        .post('/update/user')
        .set('Content-Type', 'application/json')
        .send(updateUser)
        .end(function(err, res) {
          expect(res.text).to.equal('success');
          done();
        });
  });

  it('Test 5: delete current session', function(done) {
    authenticatedUser
        .delete('/delete/session')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.body.result).to.equal('Success');
          done();
        });
  });

  const tempUser = {
    'username': 'non9',
    'password': '1234',
  };

  // if success, the password changed successfully
  it('Test 6: Recreate a session for current user with updated password',
      function(done) {
        authenticatedUser
            .post('/create/session')
            .set('Content-Type', 'application/json')
            .send(tempUser)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(302);
              expect(res.text)
                  .to.equal('Found. Redirecting to session/success');
              done();
            });
      });

  const tempUpdateUser = {
    'username': 'non9',
    'updateField': {
      'oldPassword': '1234',
      'newPassword': '2233',
    },
  };

  // so that next time run test 2 will not cause error due to wrong password
  it('Test 7: reupdate password back to original', function(done) {
    authenticatedUser
        .post('/update/user')
        .set('Content-Type', 'application/json')
        .send(tempUpdateUser)
        .end(function(err, res) {
          expect(res.text).to.equal('success');
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
          done();
        });
  });

  it('Test 9: error if read invalid user', function(done) {
    authenticatedUser
        .get('/read/user')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.text).to.equal('error');
          done();
        });
  });

  it('Test 10: error if delete invalid user', function(done) {
    authenticatedUser
        .delete('/delete/user')
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          expect(res.text).to.equal('error');
          done();
        });
  });

  const invalidUser = {
    'username': 'dave',
  };
  it('Test 11: error if missing field when creating user', function(done) {
    authenticatedUser
        .post('/create/user')
        .set('Content-Type', 'application/json')
        .send(invalidUser)
        .end(function(err, res) {
          expect(res.body.error).to.equal('MISSING FIELD');
          done();
        });
  });

  const invalidUpdate = {
    'username': 'dave',
  };
  it('Test 12: error if update field is missing', function(done) {
    authenticatedUser
        .post('/update/user')
        .set('Content-Type', 'application/json')
        .send(invalidUpdate)
        .end(function(err, res) {
          expect(res.body.error).to.equal('MISSING UPDATE DATA');
          done();
        });
  });

  afterAll(() => {
    server.close();
  });
});
