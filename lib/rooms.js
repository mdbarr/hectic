'use strict';

const EventEmitter = require('events');

module.exports = function(hectic) {
  class Room extends EventEmitter {
    constructor(options = {}) {
      super();

      this.config = {
        id: options.id || hectic.utils.id(),
        object: 'room',
        area: options.area || null,
        dimensions: { // 12x12x12 ft dimensions
          length: options.length || 12,
          width: options.width || 12,
          height: options.height || 12
        },
        weather: options.weather || null,
        connections: options.connections || {}
      };

      this.flags = {
        airborn: false,
        drivable: false,
        flyable: false,
        indoors: true,
        surveilled: false,
        swimable: false,
        traversable: true,
        underwater: false
      };

      this.computed = {
        elevation: 0, // 0 ft above sea level
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
