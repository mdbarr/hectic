'use strict';

const uuid = require('uuid/v4');

function Utils() {
  const self = this;

  self.id = () => { return uuid(); };
  self.timestamp = () => { return Date.now(); };

  return self;
}

module.exports = function() {
  return new Utils();
};
