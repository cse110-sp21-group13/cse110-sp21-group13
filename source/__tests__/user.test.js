const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const baseUrl = "localhost:3001/";
chai.use(chaiHttp);

var app = require('../start');
var request = require('supertest');
var authenticatedUser = request.agent(app);

describe("User REST API Unit Test", function(){
    var user;
    var firstUser = {
        'username': 'non9',
        'password': '2233'
    };
    user = firstUser.username;
    //create route of user functions correctly, but since it requires 
    //new username each time, I comment it out.
    it('Test 1: create a valid user', function(done) {
        chai.request(baseUrl)
        .post('create/user')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body.id).to.equal(firstUser.username);
            user = firstUser.username;
            done();
        });
    });

    // log in/ create the session
    it('Test 2: create a session for the user', function(done){
        authenticatedUser
        .post('/create/session')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function(err,res){
            expect(res.statusCode).to.equal(302);
            done();
        });
    });

    //Get the user of current session
    it('Test 3: get the current user', function (done) {
        authenticatedUser
        .get('/read/user')
        .set('Content-Type', 'application/json')
        .end(function(err, res){
            expect(res.body.username).to.equal(user);
            expect(res.body.docType).to.equal('user');
            done();
        });
    });

    var updateUser = {
        "username": "non9",
        "updateField": {
            "password": "2233"
        }
    }
    it('Test 4: update the current user', function(done){
        authenticatedUser
        .post('/update/user')
        .set('Content-Type', 'application/json')
        .send(updateUser)
        .end(function(err,res){
            //console.log(res.text);
            expect(res.text).to.equal("success");
            done();
        });
    });

    it('Test 5: delete current session', function(done){
        authenticatedUser
        .delete('/delete/session')
        .set('Content-Type', 'application/json')
        .end(function(err,res){
            expect(res.body.result).to.equal("Success");
            done();
        });
    });

    it('Test 6: Recreate a session for current user', function(done){
        authenticatedUser
        .post('/create/session')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function(err,res){
            expect(res.statusCode).to.equal(302);
            done();
        });
    });

    it('Test 7: delete current user', function(done){
        authenticatedUser
        .delete('/delete/user')
        .set('Content-Type', 'application/json')
        .end(function(err,res){
            expect(res.text).to.equal("success");
            done();
        });
    });


})