import { limitPost } from '../../common/request';
import { uploadImgOptions, uploadImgResponse } from './type';

const url = 'api/upload';
export const uploadImgLimitRequest = async (options: uploadImgOptions) => {
  const { formData } = options;
  console.log(formData);
  return limitPost<uploadImgResponse>({
    input: `${url}/upload-img`,
    init: { body: formData },
  });
};
