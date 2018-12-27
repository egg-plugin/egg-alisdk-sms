'use strict';
const SMSClient = require('./app/initial/SMSClient');

module.exports = app => {
  app.beforeStart(async () => {
    // 在app上挂载smsClient,可全局调用
    app.smsClient = SMSClient(app);
  });
};
