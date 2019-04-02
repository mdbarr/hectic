'use strict';

const EventEmitter = require('events');

module.exports = function(hectic) {
  class Room extends EventEmitter {
    constructor(options = {}) {
      super();

      this.config = {
        id: options.id || hectic.utils.id(),
        object: 'room',
        area: options.area,
        weather: options.weather || null,
        neighbors: options.neighbors || {}
      };

      this.flags = {
        airborn: false,
        drivable: false,
        flyable: false,
        indoors: true,
        swimable: false,
        underwater: false
      };

      this.computed = {
        altitude: 0, // 0 ft above sea level
        illuminance: 2000, // 2000 lux - 120,000 bright sun, 1 lux moonlight
        noise: 50, // 50 dB ambient noise
        radiation: 1.5, // 1.5 millirems / day
        temperature: 65, // 65 degrees fahrenheit

        weather: {}
      };

      this.contents = {
        occupants: {},
        objects: {}
      };
    }
  }

  return Room;
};
