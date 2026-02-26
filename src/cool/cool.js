cool = require('cool-ascii-faces');

// Returns an randomly generated cool face as an H1
function coolFace() {
  return `<html><body><h1> 
        ${cool()}
        +</h1></body></html>`;
}

module.exports = {
  coolFace
};