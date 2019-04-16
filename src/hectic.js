'use strict';

require('barrkeep/shim');

const defaults = {
  'short-id-length': 8,
  port: 4000
};

function Hectic(config = {}) {
  const self = this;

  //////////
  // Config

  self.config = Object.$merge(defaults, config, true);

  //////////
  // Modules

  self.utils = require('./utils')(self);

  //////////
  // Class Loader

  self.types = require('./types')(self);

  // Library
  self.library = require('./library')(self);

  //////////
  // Boot

  self.boot = () => {};

  return this;
}

module.exports = Hectic;
