'use strict';

module.exports = function(hectic) {
  class Player extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'player',
        name: options.name || 'Unnamed Player',
        description: options.description || 'Undescribed Player'
      });
    }
  }

  return Player;
};
