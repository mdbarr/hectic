'use strict';

require('barrkeep/shim');

const defaults = {
  'short-id-length': 8,
  port: 4444,
  game: {
    clock: undefined,
    plugins: [],
    start: 'bba16a50',
    worlds: [ 'cd66d230', 'af205132' ]
  }
};

function Hectic(config = {}) {
  const self = this;

  // Configuration
  self.config = Object.$merge(defaults, config, true);

  // Utility Modules
  self.utils = require('./utils')(self);

  // Primitive defintions
  self.primitives = require('./primitives')(self);

  // Constants
  self.constants = require('./constants')(self);

  // Type definitions
  self.types = require('./types')(self);

  // Library loader
  self.library = require('./library')(self);

  // Telnet server
  self.telnet = require('./telnet')(self);

  // Game engine
  self.game = require('./game')(self);

  //////////

  self.boot = (callback) => {
    self.telnet.boot(() => {
      console.log('Ready for connnections');
      callback();
    });
  };

  self.shutdown = (callback) => {
    self.telnet.shutdown(callback);
  };

  //////////

  return this;
}

module.exports = Hectic;
