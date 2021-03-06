const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visiting', () => {
  describe('new video page', () => {
    it('can save new video', () => {
      // Setup
      const videoToCreate = buildVideoObject();

      // Exercise
      browser.url('/videos/create');
      browser.setValue('#title-input', videoToCreate.title);
      browser.setValue('#description-input', videoToCreate.description);
      browser.setValue('#url-input', videoToCreate.url);

      browser.submitForm('#addVideo');

      // Verify
      assert.include(browser.getText('body'), videoToCreate.title);
    });
  });
});
