'use strict';

const Controller = require('egg').Controller;
const sendCodeRule = {
  phone: 'phoneNum',
  signName: 'string',
  templateCode: 'string',
  outId: {
    type: 'string',
    required: false,
  },
};
const checkCodeRule = {
  phone: 'phoneNum',
  code: {
    type: 'string',
    min: 6,
    max: 6,
  },
  timeLimit: {
    type: 'int',
    min: 1,
  },
};
class smsController extends Controller {
  async sendCode() {
    const { service, ctx } = this;
    ctx.validate(sendCodeRule);
    const data = ctx.request.body;
    const result = await service.sms.sendSMS(data);
    ctx.status = result.success ? 200 : 422;
    ctx.body = result;
  }
  async checkCode() {
    const { service, ctx } = this;
    ctx.validate(checkCodeRule);
    const data = ctx.request.body;
    const result = await service.sms.checkCode(data);
    ctx.status = result.success ? 200 : 422;
    ctx.body = result;
  }
}

module.exports = smsController;
