'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/v1/sendCode', controller.sms.sendCode);
  router.post('/api/v1/checkCode', controller.sms.checkCode);
};
