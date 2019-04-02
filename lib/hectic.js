'use strict';

require('barrkeep/shim');

const defaults = {};

function Hectic(config = {}) {
  const self = this;

  //////////
  // Config

  self.config = Object.$merge(defaults, config, true);

  //////////
  // Boot

  self.boot = () => {};

  return this;
}

module.exports = Hectic;
