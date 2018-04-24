const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

describe('Server path: /videos', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('returns a 302 status code', async () => {

      const videoToCreate = {
        title: '',
        description: '',
        url: ''
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      assert.equal(response.status, 302);
    });

    it('creates and saves video', async () => {

      const videoToCreate = {
        title: 'Video title',
        description: 'Video description',
        url: 'www.url.com'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      const videoCreated = await Video.findOne(videoToCreate);
      assert.isOk(videoCreated, 'Video was not created successfully in the database');
    });
  });


});
