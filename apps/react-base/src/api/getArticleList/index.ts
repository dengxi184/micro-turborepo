import { get } from '../../common/request';
import { getListOptions } from './type';

const url = 'api/article/fetch-article-list';
export const getListRequest = async (options: getListOptions) => {
  const { id, type, curPage, pageSize } = options;
  return get({
    input: `${url}?type=${type}&id=${id}&curPage=${curPage}&pageSize=${pageSize}`,
    init: {},
  });
};
