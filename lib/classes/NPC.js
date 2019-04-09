'use strict';

module.exports = function(hectic) {
  class NPC extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        object: 'npc',
        name: options.name || 'Unnamed NPC',
        description: options.description || 'Undescribed NPC'
      });
    }
  }

  return NPC;
};