import type { ReqProps, RequestInitProps } from '..';

export const defaultRequestInterceptor: ReqProps = (init: RequestInitProps) => {
  if (!init.method) init.method = 'get';
  return init;
};

export default [defaultRequestInterceptor];
