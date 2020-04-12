'use strict';

const telnet = require('./telnet');

function Server () {
  this.server = telnet.createServer((client) => {
    client.on('window size', (event) => {
      if (event.command === 'sb') {
        console.log('telnet window resized to %d x %d', event.width, event.height);
      }
    });

    client.on('data', (data) => {
      client.write(data);
    });

    client.do.transmit_binary();
    client.do.window_size();

    client.write('connected to Telnet server!');
  });

  this.start = () => {
    this.server.listen(4444);
  };
}

module.exports = Server;
