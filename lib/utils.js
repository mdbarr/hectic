'use strict';

const uuid = require('uuid/v4');

function Utils() {
  const self = this;

  const dictionary = {};

  self.id = function(object) {
    const id = uuid();
    if (object) {
      dictionary[id] = object;
    }
    return id;
  };

  self.timestamp = (string) => { return string ? new Date(string).toDate() : Date.now(); };

  return self;
}

module.exports = function() {
  return new Utils();
};
