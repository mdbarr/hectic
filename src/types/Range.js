'use strict';

module.exports = function(hectic) {
  class Range {
    constructor(minimum, maximum, average) {
      this.minimum = minimum;
      this.maximum = maximum;
      this.average = average;
    }
  }

  hectic.types.register('Range', Range);
};
