const request = require('supertest');
const app = require('../../source/start');
const server = require('../../source/start');

describe('Test the root path', () => {
  test('It should response the GET method', (done) => {
    request(app)
        .get('/')
        .then((response) => {
          expect(response.statusCode).toBe(200);
          done();
        });
  });

  afterAll((done) => {
    server.close();
  });
});
