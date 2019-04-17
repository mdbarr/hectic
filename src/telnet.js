'use strict';

const net = require('net');
const readline = require('readline');

function Telnet(hectic) {
  const self = this;

  self.server = net.createServer((connection) => {
    connection.rl = readline.createInterface({
      input: connection,
      output: connection,
      prompt: '> '
    });

    connection.rl.question('Login: ', (username) => {
      console.log('username', username);
    });
  });

  self.boot = function(callback) {
    return self.server.listen(hectic.config.port, () => {
      console.log('server bound');
      callback();
    });
  };

  self.shutdown = function(callback) {
    return self.server.close(callback);
  };
}

module.exports = function(hectic) {
  return new Telnet(hectic);
};
