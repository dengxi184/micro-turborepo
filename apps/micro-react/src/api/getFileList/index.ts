import { get } from '../../common/request';
import { getFileListResponse } from './type';

const url = 'api/upload/upload-list';
export const getFileListRequest = async () => {
  return get<getFileListResponse[]>({ input: `${url}`, init: {} });
};
