const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');


describe('User visits landing page', () => {
  describe('with no existing videos', () => {
    it('shows no videos', () => {
      // Setup
      browser.url('/');
      // Verify
      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('can navigate', () => {
    it('to create video page', () => {
      // Setup
      browser.url('/');
      // Exercise
      browser.click('a[href="/videos/create"]');
      // Verify
      assert.include(browser.getText('body'), 'Save a video');
    });
  });

  describe('with existing videos', () => {
    it('renders it in the list', () => {
      // Setup
      const videoToCreate = buildVideoObject();
      // Exercise
      browser.url('/videos/create');
      browser.setValue('#url-input', videoToCreate.url);
      browser.setValue('#title-input', videoToCreate.url);
      browser.setValue('#description-input', videoToCreate.url);
      browser.submitForm('#addVideo');
      browser.url('/videos');

      // Verify
      assert.include(browser.getText('#videos-container'), videoToCreate.url);
    });

    it('can navigate to a video', () => {
      // Setup
      const generateRandomUrl = (domain) => {
        return `http://${domain}/${Math.random()}`;
      };
      const randUrl = generateRandomUrl('localhost:8001')

      // Exercise
      browser.url(randUrl);
      const newUrl = browser.getUrl();

      //Verify
      assert.equal(newUrl, randUrl);
    });
  });
});
