import { post } from '../../common/request';
import { validateOptions, validateResponse } from './type';

const url = 'api/user/validate';
export const toPrivateRequest = async (options: validateOptions) => {
  post({ input: url, init: { body: { ...options } } });
};
