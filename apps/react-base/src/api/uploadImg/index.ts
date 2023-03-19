import { post } from '../../common/request';

const url = 'upload/api/uploadImg';
export const uploadImgRequest = async (options: any) => {
  console.log(options);
  post({ input: url, init: { body: { ...options } } });
};
