import { Suspense, useEffect } from 'react';
import { Button, Breadcrumb } from '@arco-design/web-react';
import { Route, Routes, Link } from 'react-router-dom';

import { getStorage, removeStorage } from '../../storage';
import AuthComponent from '../AuthComponent';
import lazyWithPreload from '../../utils/lazyWithPreload';
import './index.less';

const ReactApp = lazyWithPreload(() => import('./ReactApp'));
const VueApp = lazyWithPreload(() => import('./VueApp'));

// 路由鉴权组件
const BreadcrumbItem = Breadcrumb.Item;

const preloadComponents = [VueApp, ReactApp];

const ChildApp = () => {
  useEffect(() => {
    requestIdleCallback(preload, { timeout: 1000 }); // 延后了当前回调的过期时间， 添加了该参数当前帧可能会不执行该回调， 不添加的话，即使当前帧时间用完， 也会执行回调？
  });

  const preload = async (deadline: IdleDeadline) => {
    // deadline 上面有一个 timeRemaining() 方法，能够获取当前浏览器的剩余空闲时间，单位 ms；有一个属性 didTimeout，表示是否超时(宏任务或动画渲染把当前帧的33ms全部用完这个值才是true)
    if (deadline.timeRemaining() > 10 && preloadComponents.length) {
      preloadComponents.pop()?.preload();
      console.log('组件成功预加载！');
    }
    // 走到这里，说明时间不够了，就让出控制权给主线程，如果有需要下次空闲时继续调用
    preloadComponents.length && requestIdleCallback(preload);
  };

  const loginState = (getStorage('token') && true) ?? false;

  const jumpToLogin = () => {
    loginState && removeStorage('token');
    !loginState && removeStorage('user-state');
    window.location.href = '/';
  };

  return (
    <>
      {loginState ? (
        <>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to={'/app1'}>生活日常记录</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={'/app2'}>个人博客</Link>
            </BreadcrumbItem>
          </Breadcrumb>
          <Suspense fallback={null}>
            <Routes>
              <Route
                path="/app1/*"
                element={
                  <AuthComponent>
                    <ReactApp />
                  </AuthComponent>
                }
              />
              <Route
                path="/app2/*"
                element={
                  <AuthComponent>
                    <VueApp />
                  </AuthComponent>
                }
              />
            </Routes>
          </Suspense>
        </>
      ) : (
        <Suspense fallback={null}>
          <VueApp />
        </Suspense>
      )}
      <Button type="outline" className={'loginBtn'} onClick={jumpToLogin}>
        {loginState ? '退出登录' : '登录'}
      </Button>
    </>
  );
};

export default ChildApp;
