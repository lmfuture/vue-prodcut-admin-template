//判断名称不能为空
export function checkNameReg(rule, value, callback){
  if (!value) {
    return callback(new Error('当前项不能为空'));
  } else {
    callback();
  }
}
//判断账号不能为空
export function checkAccoutReg(rule, value, callback){
  if (!value) {
    return callback(new Error('账号不能为空'));
  } else {
    callback();
  }
}
//判断手机号正则
export function checkTelReg(rule, value, callback){
  if (!value) {
    return callback(new Error('手机号不能为空'));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号'));
    }
  }
}
//单选或多选正则
export function checkSelectReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请选择'));
  } else {
    callback();
  }
}

//全是大写英文正则
export function checkCapitalReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入英文名称'));
  } else {
    const reg=/^[A-Z]/
    if(reg.test(value)){
      callback()
    }else{
      return callback(new Error('名称必须都是大写'));
    }
  }
}
//只能是数字正则
export function checkSortReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入排序'));
  } else {
    const reg=/^([1-9][0-9]*)/
    if(reg.test(value)){
      callback()
    }else{
      return callback(new Error('排序输入不正确'));
    }
  }
}
//链接正则
export function checkLinkReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入链接'));
  } else {
    callback()
  }
}
//上传文件正则
export function checkUploadReg(rule, value, callback) {
  console.log(value);
  if (!value) {
    return callback(new Error('请上传文件'));
  } else {
    callback()
  }
}
//1~31号正则验证
export function checkMonthReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入日期'));
  } else {
    const reg=/^([1-9]|[1-2][0-9]|3[0-1])$/;
    if(reg.test(value)){
      callback()
    }else{
      return callback(new Error('只能输入1~31范围数字'));
    }
  }
}
//输入价格的正则
export function checkMoneyReg(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入价格'));
  } else {
    const reg=/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
    if(reg.test(value)){
      callback()
    }else{
      return callback(new Error('价格格式不正确'));
    }
  }
}



