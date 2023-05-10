import { Cfetch, interceptors } from './fetch';
import requestInterceptors from './requestInterceptors';
import responseInterceptors from './responseInterceptors';

export interface InterceptorsResProps<T> {
  (init: T): T | Promise<T>;
}

export interface InterceptorsReqProps<T> {
  (init: T): T;
}

export type RequestInitProps = Omit<RequestInit, 'body'> & {
  body?: { [key: string]: any };
  supportCancel?: boolean;
};
export type ReqProps = InterceptorsReqProps<RequestInitProps>;
export type ReqResErrProps = InterceptorsResProps<any>;
export type ResProps = InterceptorsResProps<Response>;

export interface IConfigProps {
  input: RequestInfo | URL;
  init: RequestInitProps;
}

let configDefault = {
  showError: true,
  canEmpty: false,
  returnOrigin: false,
  withoutCheck: false,
  mock: false,
  timeout: 10000,
};

// 添加请求拦截器
requestInterceptors.forEach((interceptor) => {
  interceptors.request.use(interceptor);
});

// 添加响应拦截器
responseInterceptors.forEach((interceptor) => {
  interceptors.response.use(interceptor);
});

const baseUrl = 'http://localhost:3000/';

const abortMap = new Map();

const request = <T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  config: IConfigProps,
) => {
  // 支持中断请求
  const additionalConfig: {
    signal?: AbortSignal;
    abort?: () => void;
  } = {};

  config!.init!.method = method;

  if (config?.init?.supportCancel) {
    const key = `${config.input}-${method}`;
    const abortFn = abortMap.get(key);
    abortFn && abortFn();
    const controller = new AbortController();
    const abort = () => {
      controller.abort();
    };
    additionalConfig.signal = controller.signal;
    abortMap.set(key, abort);
  }
  return Cfetch(
    Object.assign(
      { ...config, input: baseUrl + config.input },
      configDefault,
      additionalConfig,
    ),
  ) as unknown as Promise<T>;
};

export const get = <T = any>(config: Omit<IConfigProps, 'method'>) =>
  request<T>('GET', config);

export const post = <T = any>(config: Omit<IConfigProps, 'method'>) =>
  request<T>('POST', config);

export const put = <T = any>(config: Omit<IConfigProps, 'method'>) =>
  request<T>('PUT', config);

export const del = <T = any>(config: Omit<IConfigProps, 'method'>) =>
  request<T>('DELETE', config);

export const fetch = Cfetch;
