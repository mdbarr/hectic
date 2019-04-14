'use strict';

module.exports = function(hectic) {
  hectic.types = {};

  const lookup = {};

  hectic.types.register = function(name, Constructor) {
    hectic.types[name] = Constructor;

    const object = name.toLowerCase();
    lookup[object] = Constructor;
  };

  hectic.types.create = function(item) {
    const object = item.object;
    if (lookup[object]) {
      const Constructor = lookup[object];
      return new Constructor(item);
    }
    return undefined;
  };

  const dependencies = [
    // Utility Types (no inheritance)
    'Range',
    // Primary Types
    'Event',
    'Emitter',
    'Monad',
    'Clock',
    'World',
    'Climate',
    'Weather',
    'Region',
    'Area',
    'Link',
    'Room',
    'Person',
    'Player',
    'NPC',
    'Creature',
    'Object'
  ];

  dependencies.forEach((item) => {
    require(`./${ item }`)(hectic);
  });

  return hectic.types;
};
