const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');

const {connectDatabaseAndDropData, disconnectDatabase} = require('../database-utils');

const {
  buildVideoObject,
  findIFrameElementBySource,
  parseTextFromHTML,
  seedItemToDatabase
} = require('../test-utils');

describe('Server: GET', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('/videos', () => {
    it('renders a video with a title', async () => {
      const video = await seedItemToDatabase();

      const response = await request(app)
      .get(`/videos`);

      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
    });
  });

  describe('/videos/:id', () => {
    it('renders single video', async () => {

      const video = await seedItemToDatabase();
      const response = await request(app)
        .get(`/videos/${video._id}`);

      assert.equal(parseTextFromHTML(response.text, '.video-title'), video.title);

    });
  });

  describe('/videos/:id/edit', () => {
    it('renders a form to edit video', async () => {

      const video = await seedItemToDatabase();
      const response = await request(app)
        .get(`/videos/${video._id}/edit`);

      assert.equal(parseTextFromHTML(response.text, '#title-input'), video.title);

    });
  });

});

describe('Server: POST', () => {

  beforeEach(connectDatabaseAndDropData);

  afterEach(disconnectDatabase);

  describe('/videos', () => {

    it('returns a 302 status code', async () => {

      const videoToCreate = buildVideoObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      assert.equal(response.status, 302);
    });

    it('redirects to show Video page', async () => {

      const videoToCreate = buildVideoObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      const videoCreated = await Video.findOne(videoToCreate);

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `videos/${videoCreated._id}`);
    });

    it('saves a video document', async () => {

      const videoToCreate = buildVideoObject();
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(videoToCreate);

      const videoCreated = await Video.findOne(videoToCreate);
      assert.isOk(videoCreated, 'Video was not created successfully in the database');
    });

  });

  describe('when title is missing', () => {

    it('does not save', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 0);
    });

    it('responds with a 400 status', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 0);
      assert.equal(response.status, 400);

    });

    it('renders the video form', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('preserves form data', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      assert.include(parseTextFromHTML(response.text, '#description-input'), invalidVideoToCreate.description);

    });

  });

  describe('when URL is missing', () => {

    it('displays an error message', async () => {

      const invalidVideoToCreate = {
        title: 'test title',
        description: 'test description',
        url: ''
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('preserves form data', async () => {

      const invalidVideoToCreate = {
        title: 'test title',
        description: 'test description',
        url: ''
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      assert.include(parseTextFromHTML(response.text, '#title-input'), invalidVideoToCreate.url);

    });
  });

  describe('/videos/:id/delete', () => {

    it('removes the record', async () => {
      const video = await seedItemToDatabase();
      const response = await request(app)
             .get(`/videos/${video._id}/delete`);

      assert.equal(response.status, 404);
    })

    it('redirects to the landing page', async () => {
      const video = await seedItemToDatabase();
      const response = await request(app)
             .get(`/videos/${video._id}/delete`);

      assert.equal(response.headers.location, '/');
    });
  });

  describe('/videos/:id/updates', () => {
    it('it updates the record', async () => {

      const video = await seedItemToDatabase();
      const response = await request(app)
        .post('/updates')
        .type('form')
        .send({ title: 'Updated Video Title' });


      assert.include(parseTextFromHTML(response.text, '.video-title'), 'Updated Video Title');

    });

    it('redirects to the show page', async () => {

      const video = await seedItemToDatabase();
      const response = await request(app)
        .post('/updates')
        .type('form')
        .send({ title: 'Updated Video Title' });

      assert.equal(response.status, 302);
      assert.equal(response.header.location, `/videos/${video._id}`);

    });
  });

  describe('when update is invalid', () => {

    it('does not save', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/updates')
        .type('form')
        .send(invalidVideoToCreate);

      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 0);
    });

    it('responds with a 400 status', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/updates')
        .type('form')
        .send(invalidVideoToCreate);

      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 0);
      assert.equal(response.status, 400);

    });

    it('renders the edit form', async () => {

      const invalidVideoToCreate = {
        title: '',
        description: 'test description',
        url: 'testurl.com'
      };

      const response = await request(app)
        .post('/updates')
        .type('form')
        .send(invalidVideoToCreate);

      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });

});
