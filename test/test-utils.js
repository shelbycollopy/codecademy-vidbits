const {jsdom} = require('jsdom');

const Video = require('../models/video');

// Create and return a sample Video object
const buildVideoObject = (options = {}) => {
  const title = options.title || 'Not Hotdog';
  const url = options.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const description = options.description || 'The best video';
  return {title, url, description};
};

// Find image element by it's source
const findIFrameElementBySource = (htmlAsString, src) => {
  const video = jsdom(htmlAsString).querySelector(`iframe[src="${src}"]`);
  if (video !== null) {
    return video;
  } else {
    throw new Error(`Video with src "${src}" not found in HTML string`);
  }
};

// Add a sample Video object to mongodb
const seedItemToDatabase = async (options = {}) => {
  const video = await Video.create(buildVideoObject(options));
  return video;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

module.exports = {
  buildVideoObject,
  findIFrameElementBySource,
  seedItemToDatabase,
  parseTextFromHTML,
};
