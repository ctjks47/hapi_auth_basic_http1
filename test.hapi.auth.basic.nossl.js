'use strict';

const Hapi = require('hapi');
const bcrypt = require('bcrypt');
var Blankie = require('blankie');
var Scooter = require('scooter');
const Inert = require('inert');

const fs = require('fs');
const server = new Hapi.Server();
const users = {
  john: {
    username: 'john',
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
    name: 'John Doe',
    id: '2133d32a'
  }
};

server.connection({
  port: 80
});

server.register([
  {
    register: require('hapi-auth-basic')
  },{
    register: Inert,
    options: {}
  },{
    register: Scooter,
    options: {}
  },{
    register: Blankie,
    options: {scriptSrc: 'self'}
  }
], function (err) {
  if (err) {
    throw err;
  }

  server.auth.strategy('simple', 'basic', {
    validateFunc: function (request, username, password, callback) {
      const user = users[username];
      if (!user) {
        return callback(null, false);
      }
      bcrypt.compare(password, user.password, function (err, isValid) {
        callback(err, isValid, {
          id: user.id,
          name: user.name
        });
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/auth',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        reply('hello, ' + request.auth.credentials.name);
      }
    }
  });
});

server.start(function () {
  console.log('Now Visit: http://localhost:' + port);
});
