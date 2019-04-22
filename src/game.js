'use strict';

function Game(hectic) {
  const self = this;

  self.clock = new hectic.types.Clock(hectic.config.game.clock);

  self.commands = {};
  self.users = {};

  self.worlds = hectic.config.game.worlds;


  return this;
}

module.exports = function(hectic) {
  return new Game(hectic);
};
