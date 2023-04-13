import type { ReqProps, RequestInitProps } from '.';
import { getStorage } from '../../storage';

export const defaultRequestInterceptor: ReqProps = (init: RequestInitProps) => {
  if (!init.method) init.method = 'get';
  const token = getStorage('token');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const configDefault = Object.assign(init, {
    headers: myHeaders,
    body: JSON.stringify(init.body),
  });
  return configDefault;
};

export default [defaultRequestInterceptor];
