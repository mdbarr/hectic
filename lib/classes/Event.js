'use strict';

module.exports = function(hectic) {
  class Event {
    constructor({
      type = 'none', data = null, bubble = true,
      subject = null, directObject = null, indirectObject = null
    }) {
      this.id = hectic.utils.id();
      this.object = 'event';
      this.type = type;
      this.data = data;

      this.subject = subject;
      this.directObject = directObject;
      this.indirectObject = indirectObject;

      this.$bubble = bubble;
      this.$handled = false;
    }
  }

  return Event;
};
