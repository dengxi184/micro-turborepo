import { del } from '../../common/request';

const url = 'api/article/delete';
export const delArticleRequest = async (options: any) => {
  const { id } = options;
  return del({ input: `${url}?id=${id}`, init: {} });
};
