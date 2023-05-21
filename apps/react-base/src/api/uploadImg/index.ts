import { limitPost } from '../../common/request';

const url = 'api/upload';
export const uploadImgLimitRequest = async (formData: FormData) => {
  return limitPost({
    input: `${url}/upload-img`,
    init: { body: formData },
  });
};
