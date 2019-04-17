'use strict';

module.exports = function() {
  class Range {
    constructor(minimum, maximum, average) {
      Object.assign(this, {
        object: 'range',
        minimum,
        maximum,
        average
      });
    }
  }

  return Range;
};
