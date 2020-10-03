'use strict';

const { v4: uuid } = require('uuid');
const { deepClone } = require('barrkeep/utils');

function merge (objectA, objectB, { create = true, strict = true } = {}, seen) {
  if (create) {
    objectA = deepClone(objectA);
  }

  seen = new Set(seen);

  const keys = Object.getOwnPropertyNames(objectB);
  for (const key of keys) {
    if (!strict || key in objectA) {
      if (typeof objectB[key] === 'object' && !seen.has(objectB[key])) {
        if (typeof objectA[key] === 'object') {
          objectA[key] = merge(objectA[key], objectB[key], {
            create,
            strict,
          }, seen);
        } else if (create) {
          objectA[key] = deepClone(objectB[key]);
        } else {
          objectA[key] = objectB[key];
        }

        seen.add(objectB[key]);
      } else {
        objectA[key] = objectB[key];
      }
    }
  }
  return objectA;
}

module.exports = {
  merge,
  uuid,
};
