'use strict';

const {
  uuid, merge,
} = require('./utils');

// mixins, objects, npc
function Room ({
  id, name, brief, description, properties, flags,
  attributes, links, contents, people, computed,
}) {
  this.realId = id || uuid();
  this.instanceId = null; // hasn't been instantiated yet

  this.object = 'room';

  this.name = name || 'a room';
  this.brief = brief || 'a short description';
  this.description = description || 'a long description';

  this.properties = merge({
    length: 3, // 3m
    width: 3, // 3m
    height: 3, // 3m
    occupancy: Infinity, // Infinite number of people can fit in this room
    atmosphere: 'O2',
    elevation: 0, // 0 meters above sea level
    gravity: 1, // 1g at sea level
    illuminance: 2000, // 2000 lux - 120,000 bright sun, 1 lux moonlight
    noise: 50, // 50 dB ambient noise
    pressure: 1013, // 1,013 millibars at sea level
    radiation: 1.5, // 1.5 millirems / day
    temperature: 20, // 20 degrees celsius
  }, properties);

  this.flags = merge({
    airborn: false,
    breathable: true,
    drivable: false,
    flyable: false,
    indoors: true,
    surveilled: false,
    swimable: false,
    traversable: true,
    underwater: false,
  }, flags);

  this.attributes = merge({
    wall: 'just a wall',
    jack: '#ethernet-port',
  }, attributes);

  this.links = merge({
    down: null,
    east: null,
    north: null,
    northeast: null,
    northwest: null,
    south: null,
    southeast: null,
    southwest: null,
    up: null,
    west: null,
  }, links);

  this.computed = new Proxy({}, {
    get (target, key) {
      if (key in computed) {
        if (typeof computed[key] === 'function') {
          return computed[key]();
        }
        return computed[key];
      } else if (key in this.properties) {
        return this.properties[key];
      }
      return undefined;
    },
    set (target, key, value) {
      return value;
    },
  });

  this.weather = null;

  this.contents = Array.isArray(contents) ? contents.slice() : [];
  this.people = Array.isArray(people) ? people.slice() : [];

  this.onClock = () => { };

  this.onReset = () => { };

  //////////
  // utilities

  this.tell = (message, skip) => {
    for (const person of this.people) {
      if (!skip || person.id !== skip.id) {
        person.tell(message);
      }
    }
  };

  this.look = (character) => {
    if (character.canSee(this.computed.light)) {
      character.tell(`${ this.name }\n  ${ this.description }\n`);
      // people
      // objects
    }
  };

  this.effect = () => { };

  //////////
  // character entering

  this.beforeEnter = (character) => {
    if (this.people.length + 1 > this.properties.occupancy) {
      character.tell(`${ this.brief } is full`);
      return false;
    }

    return true;
  };

  this.enter = (character, direction, mode) => {
    if (this.beforeEnter(character) === true) {
      this.people.push(character);
      this.look(character);
      this.exits(character);
      if (mode === 0) {
        this.tell(`${ character.name } arrives from the $[ direction }`, character);
      }
      this.afterEnter(character);
    }
  };
  this.afterEnter = (character) => {
    this.effect(character);
    // inform people and contents
    return true;
  };

  // character leaving
  this.beforeLeave = () => { return true; };
  this.onLeave = () => { };
  this.afterLeave = () => { return true; };

  this.beforePlace = () => { return true; };
  this.onPlace = () => { };
  this.afterPlace = () => { return true; };

  this.beforeTake = () => { return true; };
  this.onTake = () => { };
  this.afterTake = () => { return true; };

  this.beforeLook = () => { return true; };
  this.onLook = () => { };
  this.afterLook = () => { return true; };

  this.beforeLookAt = () => { return true; };
  this.onLookAt = () => { };
  this.afterLookAt = () => { return true; };

  this.beforeCommand = () => { return true; };
  this.onCommand = () => { return true; };
  this.afterCommand = () => { return true; };
}

module.exports = { Room };
