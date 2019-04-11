'use strict';

module.exports = function(hectic) {
  class Player extends hectic.types.Person {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'player',
        name: options.name || 'Unnamed Player',
        description: options.description || 'Undescribed Player'
      });

      this.preferences = Object.$merge({
        brief: false, // brief room descriptions
        channels: [ ], // subscribed communication channels (ooc, ic, system)
        compact: false, // no extra \n's
        prompt: '%E\n%H %V >' // prompt format strings
      }, options.preferences || {});
    }
  }

  hectic.types.register('Player', Player);
};
