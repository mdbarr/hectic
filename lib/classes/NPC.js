'use strict';

module.exports = function(hectic) {
  class NPC extends hectic.classes.Person {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'npc',
        name: options.name || 'Unnamed NPC',
        description: options.description || 'Undescribed NPC'
      });
    }
  }

  hectic.classes.NPC = NPC;
};
