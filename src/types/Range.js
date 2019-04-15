'use strict';

module.exports = function(hectic) {
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

  hectic.types.register('Range', Range);
};
