'use strict';

module.exports = function(hectic) {
  class Creature extends hectic.types.Monad {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'creature',
        name: options.name || 'Unnamed Creature',
        description: options.description || 'Undescribed Creature'
      });
    }
  }

  hectic.types.register('Creature', Creature);
};
