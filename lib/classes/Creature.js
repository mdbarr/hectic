'use strict';

module.exports = function(hectic) {
  class Creature extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'creature',
        name: options.name || 'Unnamed Creature',
        description: options.description || 'Undescribed Creature'
      });
    }
  }

  return Creature;
};
