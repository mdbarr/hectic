'use strict';

module.exports = function(hectic) {
  class Event {
    constructor({
      type = 'none', data = null, bubble = true
    }) {
      this.id = hectic.utils.id();
      this.object = 'event';
      this.type = type;
      this.data = data;

      this.$bubble = bubble;
      this.$handled = false;
    }
  }

  return Event;
};
