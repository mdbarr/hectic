'use strict';

module.exports = function(hectic) {
  class Clock extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'clock',
        name: options.name || 'Unnamed Clock',
        description: options.description || 'Undescribed Clock',
        scale: 10,
        interval: -1
      });
    }

    start() {
      this.interval = setInterval(this.tick, 1000 / this.scale);
    }

    stop() {
      clearInterval(this.interval);
    }

    tick() {
    }
  }

  return Clock;
};
