'use strict';

require('barrkeep/shim');

const defaults = {
  'short-id-length': 8,
  port: 4444
};

function Hectic(config = {}) {
  const self = this;

  // Configuration
  self.config = Object.$merge(defaults, config, true);

  // Utility Modules
  self.utils = require('./utils')(self);

  // Type definition
  self.types = require('./types')(self);

  // Library loader
  self.library = require('./library')(self);

  // Telnet server
  self.telnet = require('./telnet')(self);

  //////////

  self.boot = () => {
    self.telnet.boot(() => {
      console.log('Ready for connnections');
    });
  };

  //////////

  return this;
}

module.exports = Hectic;
