const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const baseUrl = "localhost:3001/";
chai.use(chaiHttp);

describe("User REST API Unit Test", function(){
    it('Test1: server is live', function(done) {
        chai.request(baseUrl)
        .get('/')
        .end(function(err, res){
            expect(res).to.have.status(200);
            done();
        });
    })
    var user;
    var firstUser = {
        'username': 'non9',
        'password': '1101103232'
    };
    it('Test 2: create a valid user', function(done) {
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
    it('Test 3: create a session for the user', function(done){
        chai.request(baseUrl)
        .post('create/session')
        .set('Content-Type', 'application/json')
        .send(firstUser)
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body.result).to.equal('Success');
            done();
        });
    })
    it('Test 4: get a user', function (done) {
        chai.request(baseUrl)
        .get('read/user')
        .set('Content-Type', 'application/json')
        .end(function(err, res){
            //console.log(res.body);
            expect(res.body.username).to.equal(user);
            expect(res.body.docType).to.equal('user');
            done();
        });
    })

})