const constants = require('./constants');
const bibliography = require('./bibliogrphy');
const library = require('./library');
const project = require('./project');
const utils = require('./utils');

const masthead = `      _
    | |
  __| | ___   ___
 / _  |/ _ \ / __|
| (_| | (_) | (__
 \__,_|\___/ \___|

The research package manager.

Discover, download, and share collections of research publications and
datasets easily. Make your research reproducible with trivial effort.`;


module.exports = {
  bibliography,
  constants,
  library,
  project,
  utils,
};