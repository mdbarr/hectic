'use strict';

module.exports = function(hectic) {
  hectic.classes = {};

  const lookup = {};

  hectic.classes.register = function(name, Constructor) {
    hectic.classes[name] = Constructor;

    const object = name.toLowerCase();
    lookup[object] = Constructor;
  };

  hectic.classes.create = function(item) {
    const object = item.object;
    if (lookup[object]) {
      const Constructor = lookup[object];
      return new Constructor(item);
    }
    return undefined;
  };

  const dependencies = [
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

  return hectic.classes;
};
