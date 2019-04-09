'use strict';

module.exports = function(hectic) {
  class Person extends hectic.classes.Emitter {
    constructor(options = {}) {
      super();

      Object.assign(this, {
        id: hectic.utils.id(this, options.id),
        instance: hectic.utils.id(this),
        object: 'person',
        name: options.name || 'Unnamed Person',
        description: options.description || 'Undescribed Person',

        pov: this, // point of view, normally self
        location: options.location || null, // current room
        inventory: options.inventory || {},
        position: 'standing'
      });

      this.flags = Object.$merge({
        helper: false, // helps fight
        idle: false, // idle connection, not interactable
        killer: false, // killed an innocent / player
        local: false, // stays within area
        scavenger: false, // picks up dropped items
        sentinel: false, // stays in room
        thief: false, // stole from innocent / player
        wimpy: false // flees battles when low on HP
      }, options.flags || {});
    }
  }

  return Person;
};
