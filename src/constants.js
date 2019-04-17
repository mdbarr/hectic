'use strict';

module.exports = {
  link: {
    direction: {
      'north': 'north',
      'east': 'east',
      'south': 'south',
      'west': 'west',
      'up': 'up',
      'down': 'down',
      'northeast': 'northeast',
      'southeast': 'southeast',
      'northwest': 'northwest',
      'southwest': 'southwest'
    },
    door: { state: {
      'open': 'open',
      'closed': 'closed',
      'locked': 'locked',
      'sealed': 'sealed',
      'smashed': 'smashed'
    } }
  },
  object: { type: {
    'ammo': 'ammo',
    'bottle': 'bottle',
    'clothing': 'clothing',
    'communicator': 'communicator',
    'container': 'container',
    'data': 'data',
    'display': 'display',
    'drug': 'drug',
    'food': 'food',
    'furniture': 'furniture',
    'key': 'key',
    'liquid': 'liquid',
    'medicine': 'medicine',
    'money': 'money',
    'ridable': 'ridable',
    'robot': 'robot',
    'scenery': 'scenery',
    'trash': 'trash',
    'treasure': 'treasure',
    'weapon': 'weapon',
    'wearable': 'wearable',
    'writable': 'writable'
  } },
  player: { position: {
    'dead': 'dead',
    'mortally-wounded': 'mortally-wounded',
    'incapacitated': 'incapacitated',
    'stunned': 'stunned',
    'sleeping': 'sleeping',
    'resting': 'resting',
    'sitting': 'sitting',
    'riding': 'rising',
    'fighting': 'fighting',
    'standing': 'standing'
  } }
};
