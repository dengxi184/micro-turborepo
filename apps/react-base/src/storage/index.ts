import { decrypt } from './decrypt';
import { encrypt } from './encrypt';

const config = {
  //type: 'localStorage', // 本地存储类型 localStorage sessionStorage
  prefix: 'micro_base', // 名称前缀 建议：项目名 + 项目版本
  expire: 0, //过期时间 单位：分钟
  isEncrypt: true, // 默认加密 为了调试方便, 开发过程中可以不加密
};

export interface IcryptProps {
  (data: any): string;
}

export const isSupStorage = () => {
  if (!window) {
    throw new Error('当前环境非浏览器，无法消费全局window实例。');
  }
  if (!window.localStorage) {
    throw new Error('当前环境非无法使用localStorage');
  }
  return typeof Storage !== 'undefined' ? true : false;
};

// 设置 setStorage
export const setStorage = (
  key: string,
  value: any,
  expire = 0,
  willOverdue = false,
) => {
  if (value === '' || value === null || value === undefined) {
    value = null;
  }

  if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number');

  expire = (expire ? expire : config.expire) * 60 * 1000;

  const data = {
    value: value, // 存储值
    time: Date.now(), //存值时间戳
    expire: expire, // 过期时间
    willOverdue,
  };

  const encryptString = config.isEncrypt
    ? encrypt(JSON.stringify(data))
    : JSON.stringify(data);
  localStorage.setItem(autoAddPrefix(key), encryptString);
};

// 获取 getStorage
export const getStorage = (key: string) => {
  let value = null;
  key = autoAddPrefix(key);
  // key 不存在判断
  if (
    !localStorage.getItem(key) ||
    JSON.stringify(localStorage.getItem(key)) === 'null'
  ) {
    return null;
  }
  // 优化 持续使用中续期
  const storage = config.isEncrypt
    ? JSON.parse(decrypt(localStorage.getItem(key)))
    : JSON.parse(localStorage.getItem(key) as string);
  const nowTime = Date.now();
  // 过期删除
  if (
    storage.expire &&
    storage.expire < nowTime - storage.time &&
    storage.willOverdue
  ) {
    removeStorage(key);
    return null;
  } else {
    // 未过期期间被调用 则自动续期 进行保活
    // setStorage(autoRemovePrefix(key), storage.value);
    if (isJson(storage.value)) {
      value = JSON.parse(storage.value);
    } else {
      value = storage.value;
    }
    return value;
  }
};

// 删除 removeStorage
export const removeStorage = (key: string) => {
  localStorage.removeItem(autoAddPrefix(key));
};

// 清空 clearStorage
export const clearStorage = () => {
  localStorage.clear();
};

// 判断是否可用 JSON.parse
export const isJson = (value: string) => {
  if (Object.prototype.toString.call(value) === '[object String]') {
    try {
      const obj = JSON.parse(value);
      const objType = Object.prototype.toString.call(obj);
      return objType === '[object Object]' || objType === '[object Array]';
    } catch (e) {
      return false;
    }
  }
  return false;
};

// 名称前自动添加前缀
const autoAddPrefix = (key: string) => {
  const prefix = config.prefix ? config.prefix + '_' : '';
  return prefix + key;
};
