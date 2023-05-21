import type { ReqProps, RequestInitProps } from '..';
import { getStorage } from '../../../storage';

export const defaultRequestInterceptor: ReqProps = (init: RequestInitProps) => {
  if (!init.method) init.method = 'get';
  const isFormData = init.body instanceof FormData;
  const token = getStorage('token');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const bodyObject = isFormData
    ? null
    : { headers: myHeaders, body: JSON.stringify(init.body) };
  return Object.assign(init, bodyObject);
};

export default [defaultRequestInterceptor];
