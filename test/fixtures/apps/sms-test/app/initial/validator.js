'use strict';

class Validator {
  constructor(app) {
    app.validator.addRule('phoneNum', (rule, value) => {
      try {
        const flag = /^[1][0-9]{10}$/.test(value);
        if (!flag) {
          throw `请输入正确手机号 ${value}`;
        }
      } catch (err) {
        return err;
      }
    });
  }
}

module.exports = Validator;
