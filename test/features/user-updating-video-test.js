const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('User visiting', () => {
  describe('update video page', () => {
    it('can save updates to video', () => {

      // Setup
      const videoToCreate = buildVideoObject();
      const updatedTitle = "New Internet";

      // Exercise
      browser.url('/videos/create');
      browser.setValue('#url-input', videoToCreate.url);
      browser.setValue('#title-input', videoToCreate.title);
      browser.setValue('#description-input', videoToCreate.description);
      browser.submitForm('#addVideo');

      browser.click('#edit');

      browser.setValue('#title-input', updatedTitle);
      browser.submitForm('#editVideo');

      browser.url('/');

      // Verify
      assert.include(browser.getText('body'), updatedTitle);

    });
  });
});
