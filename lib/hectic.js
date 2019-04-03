'use strict';

require('barrkeep/shim');

const defaults = {};

function Hectic(config = {}) {
  const self = this;

  //////////
  // Config

  self.config = Object.$merge(defaults, config, true);

  //////////
  // Modules

  self.utils = require('./utils')(self);

  //////////
  // Classes

  self.classes = { Room: require('./classes/room')(self) };

  //////////
  // Boot

  self.boot = () => {};

  return this;
}

module.exports = Hectic;
