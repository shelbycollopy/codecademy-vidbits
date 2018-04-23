const {assert} = require('chai');

describe('User visits create page', () => {
  describe('adds a new video', () => {


    it('redirects to landing and display video', () => {

      const videoToAdd = {
        title: 'Test video title',
        description: 'Test video description'
      };

      browser.url('/videos/create.html');
      browser.setValue('#title-input', videoToAdd.title);
      browser.setValue('#description-input', videoToAdd.description);
      browser.click('#submit-button');
      assert.include(browser.getText('body'), videoToAdd.title);
      assert.include(browser.getText('body'), videoToAdd.description);

    });
  });
});
