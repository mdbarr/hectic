'use strict';

// mixins, objects, npc
function Room (options) {
  this.realId = options.id;
  this.instanceId = null;

  this.object = 'room';

  this.name = 'a room';
  this.brief = 'a short description';
  this.description = 'a long description';

  this.properties = {
    length: 3,
    width: 3,
    height: 3,
    occupancy: Infinity,
    atmosphere: 'O2',
    elevation: 0, // 0 meters above sea level
    illuminance: 2000, // 2000 lux - 120,000 bright sun, 1 lux moonlight
    noise: 50, // 50 dB ambient noise
    radiation: 1.5, // 1.5 millirems / day
    temperature: 20, // 20 degrees celsius
  };

  this.weather = null;

  this.flags = {
    airborn: false,
    breathable: true,
    drivable: false,
    flyable: false,
    indoors: true,
    surveilled: false,
    swimable: false,
    traversable: true,
    underwater: false,
  };

  this.attributes = {
    wall: 'just a wall',
    jack: '#ethernet-port',
  };

  this.links = {
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
  };

  this.data = typeof options.data === 'function' ? options.data() : {};

  this.contents = [];
  this.people = [];

  this.onClock = () => { };

  this.beforeEnter = () => { return true; };
  this.onEnter = () => { };
  this.afterEnter = () => { return true; };

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
