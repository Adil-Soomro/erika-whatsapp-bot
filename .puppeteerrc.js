const { join } = require('path');

module.exports = {
  // Explicitly set cache directory for Render
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  
  // Download Chrome specifically
  chrome: {
    skipDownload: false,
  },
};
