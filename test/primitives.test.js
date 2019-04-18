'use strict';

const Hectic = require('../src/hectic');

let hectic;
let testEnum;

test('Create a hectic instance', () => {
  hectic = new Hectic();
});

describe('Enum Tests', () => {
  test('Create an enum', () => {
    testEnum = new hectic.primitives.Enum('foo', 'Bar', 'foo-bar');
    expect(testEnum).toBeInstanceOf(hectic.primitives.Enum);
  });

  test('Test simple enum values', () => {
    expect(testEnum.foo).toBe(0x01);
    expect(testEnum.bar).toBe(0x02);
    expect(testEnum.fooBar).toBe(0x04);
    expect(testEnum.notDefined).toBe(0x00);
  });

  test('Test compound enum value', () => {
    const value = testEnum.foo | testEnum.bar;

    expect(value & testEnum.foo).toBeTruthy();
    expect(value & testEnum.bar).toBeTruthy();
    expect(value & testEnum.fooBar).toBeFalsy();

    expect(value & (testEnum.foo | testEnum.fooBar)).toBeTruthy();
  });
});
