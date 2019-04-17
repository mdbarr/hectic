'use strict';

module.exports = function() {
  class Enum {
    constructor(...values) {
      const map = {};

      for (let i = 0; i < values.length; i++) {
        const key = values[i].camelize();

        const buffer = Buffer.alloc(4);
        buffer.writeUInt32(Math.pow(2, i));

        map[key] = buffer;
      }

      return new Proxy(this, {
        get(object, property) {
          const key = (property || '').camelize();
          if (map[key]) {
            return map[key].readUInt32();
          }
          return 0;
        },
        set(object, property, value) {
          const key = (property || '').camelize();
          if (map[key]) {
            throw new Error('Enum values cannot be changed');
          } else {
            map[key] = value;
          }
        }
      });
    }
  }

  return Enum;
};
