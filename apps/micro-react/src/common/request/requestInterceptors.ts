import type { ReqProps, RequestInitProps } from '.';

export type IWindow = Window &
  typeof globalThis & { getStorage: (key: string) => any };

export const defaultRequestInterceptor: ReqProps = (init: RequestInitProps) => {
  if (!init.method) init.method = 'get';
  const token = (window as IWindow).getStorage('token');
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);
  const configDefault = Object.assign(init, {
    headers: myHeaders,
    body: JSON.stringify(init.body),
  });
  return configDefault;
};

export default [];
