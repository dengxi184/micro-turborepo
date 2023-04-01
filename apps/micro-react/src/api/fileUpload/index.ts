import { get, post, del } from '../../common/request';
import {
  uploadMergeOptions,
  uploadMergeResponse,
  deleteFileOptions,
  uploadRecordOptions,
  uploadRecordResponse,
  deleteImgOptions,
  getImgListOptions,
} from './type';

const url = 'api/upload';
export const uploadFileRequest = async (options: any) => {
  return post({
    input: `${url}/upload-file`,
    init: { ...options },
  });
};

export const uploadMergeRequest = async (options: uploadMergeOptions) => {
  return get<uploadMergeResponse>({
    input: `${url}/merge?fileName=${options.fileName}&fileHash=${options.fileHash}`,
    init: {},
  });
};

export const fileUploadRecord = async (options: uploadRecordOptions) => {
  return get<uploadRecordResponse>({
    input: `${url}/record?fileName=${options.fileName}&fileHash=${options.fileHash}`,
    init: {},
  });
};

export const deleteFileRequest = async (options: deleteFileOptions) => {
  return del({
    input: `${url}/delete-file?fileHash=${options.fileHash}`,
    init: {},
  });
};

export const uploadImgRequest = async (options: any) => {
  return post({ input: `${url}/upload-img`, init: { body: options } });
};

export const deleteImgRequest = async (options: deleteImgOptions) => {
  return del({
    input: `${url}/delete-img?fileName=${options.fileName}&createAt=${options.createAt}`,
    init: {},
  });
};

export const getImgListRequest = async (options: getImgListOptions) => {
  return get({
    input: `${url}/get-img-list?keyword=${options.keyword}&curPage=${options.curPage}&pageSize=${options.pageSize}`,
    init: {},
  });
};
