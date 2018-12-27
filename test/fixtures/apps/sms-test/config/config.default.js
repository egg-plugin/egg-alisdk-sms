'use strict';

module.exports = appInfo => {
  const config = exports = {};
  config.keys = appInfo.name + '_1536045158502_6820';
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '', '127.0.0.1', '0.0.0.0' ],
  };
  config.cluster = {
    listen: {
      port: 12580,
      hostname: '0.0.0.0',
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  // 阿里短信账号id与key
  config.sms = {
    accessKeyId: 'LTAI0HpKmVZp1w8t',
    secretAccessKey: 'aZdZv5iWOTJZGkwFUbooBiSXCCZCyM',
  };
  return config;
};
