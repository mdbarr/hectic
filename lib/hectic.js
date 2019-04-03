'use strict';

require('barrkeep/shim');

const defaults = {};

function Hectic(config = {}) {
  const self = this;

  //////////
  // Config

  self.config = Object.$merge(defaults, config, true);

  //////////
  // Imports

  self.utils = require('./utils')(self);

  self.rooms = require('./rooms')(self);

  //////////
  // Boot

  self.boot = () => {};

  return this;
}

module.exports = Hectic;
