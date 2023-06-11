import type { ReqProps, RequestInitProps } from '..';

export const defaultRequestInterceptor: ReqProps = (init: RequestInitProps) => {
  if (!init.method) init.method = 'get';
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const configDefault =
    init.body instanceof FormData
      ? init
      : Object.assign(init, {
          headers: myHeaders,
          body: JSON.stringify(init.body),
        });
  return configDefault;
};

export default [defaultRequestInterceptor];
