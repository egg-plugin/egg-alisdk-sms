'use strict';
const SMSClient = require('@alicloud/sms-sdk');

// 初始化sms_client
module.exports = app => {
  const smsConfig = app.config.sms;
  const accessKeyId = smsConfig.accessKeyId;
  const secretAccessKey = smsConfig.secretAccessKey;
  const smsClient = new SMSClient({ accessKeyId, secretAccessKey });
  return smsClient;
};
