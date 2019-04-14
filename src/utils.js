'use strict';

const uuid = require('uuid/v4');

function Utils() {
  const self = this;

  //////////
  // Identifiers

  const dictionary = {};

  self.id = function(object, id) {
    id = id || uuid();
    if (object) {
      dictionary[id] = object;
    }
    return id;
  };

  Object.defineProperty(String.prototype, '$obj', {
    value() {
      if (this && dictionary[this]) {
        return dictionary[this];
      }
      return undefined;
    },
    enumerable: false,
    configurable: true
  });

  //////////

  self.timestamp = (string) => { return string ? new Date(string).toDate() : Date.now(); };

  return self;
}

module.exports = function() {
  return new Utils();
};
