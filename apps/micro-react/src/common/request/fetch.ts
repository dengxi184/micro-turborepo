import type { ReqProps, ReqResErrProps, IConfigProps, ResProps } from '.';

const interceptorsReq: ReqProps[] = [];
const interceptorsReqError: ReqResErrProps[] = [];
const interceptorsRes: ReqResErrProps[] = [];
const interceptorsResError: ReqResErrProps[] = [];

const Cfetch = (cinput: IConfigProps) => {
  const { input, init = {} } = cinput;
  const handleInit = interceptorsReq.reduce((preValue, handler) => {
    return handler(preValue);
  }, init) as RequestInit;
  return new Promise((resolve, reject) => {
    fetch(input, handleInit)
      .then((res) => {
        // handleRes 是一个pending的promise
        const handleRes = interceptorsRes.reduce((preValue, handler) => {
          return handler(preValue);
        }, res);
        resolve(handleRes);
      })
      .catch((err) => {
        const handleErr = interceptorsResError.reduce((preValue, handler) => {
          return handler(preValue);
        }, err);
        reject(handleErr);
      });
  });
};

const interceptors = {
  request: {
    use(callback: ReqProps, errorCallback?: ReqResErrProps) {
      interceptorsReq.push(callback);
      errorCallback && interceptorsReqError.push(errorCallback);
    },
  },
  response: {
    use(callback: ResProps, errorCallback?: ReqResErrProps) {
      interceptorsRes.push(callback);
      errorCallback && interceptorsResError.push(errorCallback);
    },
  },
};

export { Cfetch, interceptors };
