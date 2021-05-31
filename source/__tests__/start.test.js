const request = require('supertest');
const {app, server} = require('../../source/start');

const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('db');

describe('Test the root path', () => {
  test('It should response the GET method', (done) => {
    request(app)
        .get('/')
        .then((response) => {
          expect(response.statusCode).toBe(200);
          done();
        });
  });

  afterAll(async (done) => {
    server.close();
    await db.destroy();
  });
});
