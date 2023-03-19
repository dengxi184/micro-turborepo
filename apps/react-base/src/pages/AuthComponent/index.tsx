import React from 'react';
import { getStorage } from '../../storage';

export interface Iprops<T> {
  (children: T): T;
}

const AuthComponent: Iprops<any> = ({ children }: any) => {
  const isLogin: boolean = (getStorage('token') && true) ?? false;
  return isLogin ? <>{children}</> : (window.location.href = '/');
};
export default AuthComponent;
