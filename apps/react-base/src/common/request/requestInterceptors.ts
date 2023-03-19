import { ReqProps, RequestInitProps } from '.';
import { getStorage } from '../../storage';

export const defaultRequestInterceptor: ReqProps = (init: RequestInitProps) => {
  if (!init.method) init.method = 'get';
  const token = getStorage('token');
  const configDefault = Object.assign(init, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(init.body),
  });
  return configDefault;
};

export default [defaultRequestInterceptor];
