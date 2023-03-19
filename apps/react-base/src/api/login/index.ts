import { post } from '../../common/request';
import { loginOptions, loginResponse } from './type';

const url = 'api/auth/login';
export const loginRequest = async (options: loginOptions) =>
  post({ input: url, init: { body: { ...options }, supportCancel: true } });
