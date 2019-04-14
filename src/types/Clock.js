'use strict';

module.exports = function(hectic) {
  class Clock extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'clock',
        name: options.name || 'Default Clock',
        description: options.description || 'Default 10x Clock',
        scale: options.scale || 10,
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
      this.emit('tick');
    }
  }

  hectic.types.register('Clock', Clock);
};