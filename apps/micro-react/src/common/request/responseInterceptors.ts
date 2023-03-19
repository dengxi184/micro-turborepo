import { Message } from '@arco-design/web-react';
import { ResProps } from '.';

const host = window.location.host;

export const defaultResponseInterceptor: ResProps = async (res: Response) => {
  const contentType = res.headers.get('Content-Type');
  const clone = res.clone();
  const jsonRes = await clone.json();
  switch (contentType) {
    case 'application/json':
      return jsonRes;
    default:
      return jsonRes;
  }
};

export const handleErrorCodeResponseInterceptor: ResProps = (res: Response) => {
  const code = res.status || 200;
  switch (code) {
    case 401:
      Message.info({
        content: 'token已过期,请重新登录!',
        duration: 3000,
        onClose: () => {
          if (window.location.href !== `http://${host}/`) {
            window.location.href = '/';
          }
        },
      });
      return res;
    case 422:
      Message.info({
        content: '密码无效！',
        duration: 3000,
        onClose: () => {
          if (window.location.href !== `http://${host}/`) {
            window.location.href = '/';
          }
        },
      });
      return res;
    case 500:
      Message.info({
        content: '服务器繁忙,请稍后重新登录!',
        duration: 3000,
        onClose: () => {
          if (window.location.href !== `http://${host}/`) {
            window.location.href = '/';
          }
        },
      });
      return res;
    default:
      //Message.info('登陆成功！')
      return res;
  }
};

export default [handleErrorCodeResponseInterceptor, defaultResponseInterceptor];
