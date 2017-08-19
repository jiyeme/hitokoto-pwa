export const FUNC_REGEXP = /function\s*(?:\w*)(?:\s*)\(([^\)]*)\)(?:\s*)\{([\s\S]*)\}/gim;
export const ADAPTER_ORGIN = json => json;

export const PERSE_ADAPTER_SAFE = funcBody => {
  if (typeof funcBody != 'string') {
    return ADAPTER_ORGIN;
  } else {
    if (funcBody.trim().length == 0) {
      return ADAPTER_ORGIN;
    }
    try {
      let expectedArgs = AdapterValidate(funcBody);
      if (expectedArgs.err) {
        console.error(expectedArgs.err)
        return ADAPTER_ORGIN;
      }

      return Function.apply(null, expectedArgs);
    } catch (e) {
      console.error(e)
      return ADAPTER_ORGIN;
    }
  }
}
export const PERSE_ADAPTER = funcBody => {
  let args = AdapterValidate(funcBody);
  return Function.apply(null, args)
}
export function AdapterValidate(adapterStr) {
  'use strict';

  let matchs = FUNC_REGEXP.exec(adapterStr);
  if (!matchs) {
    throw new Error('函数格式错误！请不要使用ES6的箭头函数');
  }

  //  手动结束
  FUNC_REGEXP.exec(adapterStr);

  let args = matchs[1];
  if (!args) {
    throw new Error('至少需要一个参数！');
  }
  if (~ args.search(',')) {
    console.warn('含有无效形参！')
    args = args.split(',');
  } else {
    args = [args];
  }
  //  提取函数体
  let funcBody = matchs[2];
  if (!funcBody) {
    throw new Error('函数体不存在！请检查括号是否配对！');
  }
  //  找到return 关键字。
  if (!(~ funcBody.search('return'))) {
    //  没有return语句
    throw new Error('函数中无return 语句');
  }
  //  将函数体放入args数组;
  args.push(funcBody);
  console.log('validate adapter success!')
  return args;

}

export default {
  FUNC_REGEXP,
  ADAPTER_ORGIN,
  PERSE_ADAPTER_SAFE,
  PERSE_ADAPTER,
  AdapterValidate
};