'use strict';
const Validator = require('./app/initial/validator.js');

module.exports = app => {
  app.beforeStart(async () => {
    new Validator(app);
    // await Consul(app);
  });
};
