import CryptoJS from 'crypto-js';
import { SECRET_KEY, SECRET_IV } from '../utils/secret';
import { IcryptProps } from '.';

export const encrypt: IcryptProps = (data: any) => {
  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data);
    } catch (error) {
      console.log('encrypt error:', error);
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
    iv: SECRET_IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
};
