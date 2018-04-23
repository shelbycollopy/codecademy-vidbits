const {assert} = require('chai');

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
      browser.click('a[href="/videos/create.html"]');
      // Verify
      assert.include(browser.getText('body'), 'Save a video');
    });
  });
});
