import { post } from '../../common/request';
import { publishOptions } from './type';

const url = 'article/api/publish';
export const publishRequest = async (options: publishOptions) =>
  post({ input: url, init: { body: { ...options } } });
