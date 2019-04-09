'use strict';

module.exports = function(hectic) {
  hectic.classes = {};

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
