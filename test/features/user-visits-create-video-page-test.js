const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visiting', () => {
  describe('new video page', () => {
    it('can save new video', () => {
      // Setup
      const videoToCreate = buildVideoObject();

      // Exercise
      browser.url('/videos/create');
      browser.setValue('#url-input', videoToCreate.url);
      browser.setValue('#title-input', videoToCreate.title);
      browser.setValue('#description-input', videoToCreate.description);
      browser.submitForm('#addVideo');

      // Verify
      assert.include(browser.getText('body'), videoToCreate.title);
    //assert.include(browser.getAttribute('body img', 'src'), itemToCreate.imageUrl);
    });
  });
});
