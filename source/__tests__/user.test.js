const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const baseUrl = "localhost:3001/";
chai.use(chaiHttp);

var app = require('../start');
var request = require('supertest');
var authenticatedUser = request.agent(app);

var firstUser = {
    'username': 'non9',
    'password': '1101103232'
};
describe("User REST API Unit Test", function(){
    var user;
    user = firstUser.username;
    /*it('Test 2: create a valid user', function(done) {
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
    });*/

    // log in/ create the session
    it('Test 3: create a session for the user', function(done){
        authenticatedUser
        .post('/create/session')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function(err,res){
            expect(res.statusCode).to.equal(302);
            done();
        });
    });
    it('Test 4: get a user', function (done) {
        authenticatedUser
        .get('/read/user')
        .set('Content-Type', 'application/json')
        .end(function(err, res){
            //console.log(res.body);
            //console.log(res.body);
            expect(res.body.username).to.equal(user);
            expect(res.body.docType).to.equal('user');
            done();
        });
    })

})