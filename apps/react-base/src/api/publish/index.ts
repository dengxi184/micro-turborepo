import { post } from '../../common/request';
import { publishOptions } from './type';

const url = 'api/article/publish';
export const publishRequest = async (options: publishOptions) =>
  post({ input: url, init: { body: { ...options } } });
