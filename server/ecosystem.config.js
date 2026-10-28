const path = require('path');

module.exports = {
  apps: [
    {
      name: 'server',
      script: path.resolve(__dirname, './build/index.js'),
      // single instance only: socket rooms and poker session presence timers are kept in process memory
      exec_mode: 'fork',
      instances: 1,
      error_file: '/var/log/server-err.log',
      out_file: '/var/log/server-out.log',
      log_file: '/var/log/server-combined.log',
      time: true,
    },
  ],
};
