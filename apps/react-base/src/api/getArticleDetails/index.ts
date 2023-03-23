import { get } from '../../common/request';

const url = 'api/article/details';
export const getDetailsRequest = async (options: any) => {
  const { id } = options;
  return get({ input: `${url}?id=${id}`, init: {} });
};
