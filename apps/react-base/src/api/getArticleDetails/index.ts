import { get } from '../../common/request';

const url = 'article/api/articleDetails';
export const getDetailsRequest = async (options: any) => {
  const { id } = options;
  return get({ input: `${url}?id=${id}`, init: {} });
};
