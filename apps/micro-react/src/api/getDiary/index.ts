import { get } from '../../common/request';
import { getDiaryListResponse, getDiaryListOptions } from './type';

const url = 'api/article/fetchDiary';
export const getDiaryListRequest = async (options: getDiaryListOptions) => {
  const { id, curPage, pageSize } = options;
  return get<getDiaryListResponse>({
    input: `${url}?id=${id}&curPage=${curPage}&pageSize=${pageSize}`,
    init: {},
  });
};
