cool = require('cool-ascii-faces');

function coolFace() {
  return `<html><body><h1> 
        ${cool()}
        +</h1></body></html>`;
}

module.exports = {
  coolFace
};