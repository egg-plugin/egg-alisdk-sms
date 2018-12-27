'use strict';
const Service = require('egg').Service;
const stringRandom = require('string-random');
const moment = require('moment');
/**
 *  阿里短信服务类
 */
class smsService extends Service {
  // 生成随机6位数字
  async random() {
    try {
      return stringRandom(6, {
        letters: false,
        specials: false,
      });
    } catch (e) {
      this.logger.error(`生成随机数发送错误：${JSON.stringify(e)}`);
      return '123456';
    }
  }
  // 发送验证码
  async sendSMS(data) {
    try {
      const { ctx } = this;
      const random = await this.random();
      const result = this.app.smsClient.sendSMS({
        PhoneNumbers: data.phone,
        SignName: data.signName,
        TemplateCode: data.templateCode,
        TemplateParam: `{"code":"${random}"}`,
        OutId: data.outId || null,
      }).then(function(res) {
        ctx.logger.info(`手机号${data.phone}发送之后返回信息`, res);
        const { Code } = res;
        const result = {};
        if (Code === 'OK') {
          result.requestId = res.RequestId;
          result.bizId = res.BizId;
          return {
            success: true,
            data: result,
          };
        }
        return {
          success: false,
          message: res.data.Message || '发送失败',
        };
      }, function(e) {
        ctx.logger.error(`手机号${data.phone}发送短信中错误：${JSON.stringify(e)}`);
        // 修改业务限流的提示
        let message = e.message || e.data.Message;
        if (e.code === 'isv.BUSINESS_LIMIT_CONTROL') {
          const temp = e.message || e.data.Message;
          if (temp.indexOf('触发分钟级流控') >= 0) {
            message = '验证码已发送';
          } else if (temp.indexOf('触发小时级流控') >= 0) {
            message = '操作频繁，请稍后再试';
          } else if (temp.indexOf('触发天级流控') >= 0) {
            message = '你今日的验证次数已达上限';
          }
        }
        return {
          success: false,
          message: message || '发送失败',
        };
      });
      return result;
    } catch (e) {
      this.ctx.logger.error(`手机号${data.phone}发送短信时错误：${JSON.stringify(e)}`);
      return {
        success: false,
        message: e.message,
      };
    }
  }
  // 验证验证码
  async checkCode(data) {
    try {
      const { ctx } = this;
      const date = moment().format('YYYYMMDD');
      // 查询短信发送详情
      const result = this.app.smsClient.queryDetail({
        PhoneNumber: data.phone,
        SendDate: date,
        PageSize: '1',
        CurrentPage: '1',
      }).then(function(res) {
        ctx.logger.info(`获取${data.phone}在${date}最新一条短信信息:`, JSON.stringify(res));
        const { Code, SmsSendDetailDTOs } = res;
        let message = '';
        if (Code === 'OK') {
          // 处理发送详情内容
          const detail = SmsSendDetailDTOs.SmsSendDetailDTO[0];
          if (detail) {
            const content = detail.Content;
            const pattern = /\d{6}/;
            if (!pattern.exec(content)) {
              message = '出错 请重新获取验证码';
              return;
            }
            const realCode = pattern.exec(content)[0];
            if (realCode === data.code) {
              const receiveTime = Date.parse(detail.ReceiveDate);
              const now = Date.parse(new Date());
              // 一分钟60000ms
              const difftime = (now - receiveTime) / 60000;
              if (difftime <= data.timeLimit) {
                return {
                  success: true,
                  message: '验证通过',
                };
              }
              message = '验证码过期';

            } else {
              message = '验证码错误';
            }
          }
        }
        message = message || '无验证码记录';
        return {
          success: false,
          message,
        };
      }, function(err) {
        ctx.logger.error(`获取${data.phone}在${date}最新一条短信信息中错误：${JSON.stringify(err)}`);
        return {
          success: false,
          message: `获取${data.phone}短信错误`,
        };
      });
      return result;
    } catch (e) {
      this.ctx.logger.error(`手机号${data.phone}验证验证码时错误：${JSON.stringify(e)}`);
      return {
        success: false,
        message: `验证码验证失败: ${e.message}`,
      };
    }
  }
}

module.exports = smsService;
