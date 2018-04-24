const {assert} = require('chai');

describe('User visits create page', () => {
  describe('adds a new video', () => {
    it('is rendered', () => {

      const videoToAdd = {
        title: 'Test video title',
        description: 'Test video description',
        url: 'www.url.com'
      };

      browser.url('/videos/create.html');
      browser.setValue('#title-input', videoToAdd.title);
      browser.setValue('#description-input', videoToAdd.description);
      browser.setValue('#url-input')
      browser.click('#submit-button');
      assert.include(browser.getText('body'), videoToAdd.title);
      assert.include(browser.getText('body'), videoToAdd.description);
      assert.include(browser.getText('body'), videoToAdd.url);

    });
  });
});
