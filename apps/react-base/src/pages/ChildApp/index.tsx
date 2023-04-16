import React, { Suspense, useState, useEffect, useRef } from 'react';
import {
  Button,
  Breadcrumb,
  Modal,
  Input,
  Message,
} from '@arco-design/web-react';
import { Route, Routes, Link } from 'react-router-dom';
import { getStorage, removeStorage } from '../../storage';
import AuthComponent from '../AuthComponent';
import lazyWithPreload from '../../utils/lazyWithPreload';
import { encrypt } from '../../storage/encrypt';
import './index.less';

const ReactApp = lazyWithPreload(() => import('./ReactApp'));
const VueApp = lazyWithPreload(() => import('./VueApp'));

// 路由鉴权组件
const BreadcrumbItem = Breadcrumb.Item;

const preloadComponents = [VueApp, ReactApp];

const ChildApp = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [passWordValue, setPassWordValue] = useState<string>();

  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    requestIdleCallback(preload, { timeout: 1000 }); // 延后了当前回调的过期时间， 添加了该参数当前帧可能会不执行该回调， 不添加的话，即使当前帧时间用完， 也会执行回调？
  });

  const preload = async (deadline: IdleDeadline) => {
    // deadline 上面有一个 timeRemaining() 方法，能够获取当前浏览器的剩余空闲时间，单位 ms；有一个属性 didTimeout，表示是否超时(宏任务或动画渲染把当前帧的33ms全部用完这个值才是true)
    if (deadline.timeRemaining() > 10) {
      preloadComponents.pop()?.preload();
      console.log('组件成功预加载！');
    }
    // 走到这里，说明时间不够了，就让出控制权给主线程，如果有需要下次空闲时继续调用
    preloadComponents.length && requestIdleCallback(preload);
  };

  const toReactPart = async (event: React.MouseEvent<Element, MouseEvent>) => {
    //console.log(event.preventDefault())
    if (window.location.href.indexOf('app1') > -1)
      return Message.info('这已经是生活日常记录空间！');
    event.preventDefault();
    setVisible(true);
  };

  const loginState = (getStorage('token') && true) ?? false;

  const jumpToLogin = () => {
    loginState && removeStorage('token');
    //loginState && removeStorage('userRole')
    !loginState && removeStorage('user-state');
    window.location.href = '/';
  };

  const onOk = async () => {
    try {
      setConfirmLoading(true);
      // const rsp = await toPrivateRequest({id: getStorage('userId'), password: encrypt(passWordValue)})
      // console.log(rsp,60);
      const rsp = await fetch('http://43.136.20.18:9000/api/auth/validate', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          id: getStorage('userId'),
          pwd: encrypt(passWordValue),
        }),
      });
      if (rsp.status !== 200) throw new Error();
      Message.success('这是私人空间！');
      (linkRef.current as HTMLAnchorElement)!.click();
    } catch (err) {
      Message.error('你不是本人吧！请移步个人博客！');
    } finally {
      setVisible(false);
      setConfirmLoading(false);
    }
  };

  return (
    <>
      {loginState ? (
        <>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link ref={linkRef} to={'/app1'}>
                <span onClick={toReactPart}>生活日常记录</span>
              </Link>
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
      <div>
        <Modal
          title="Validate"
          visible={visible}
          onOk={onOk}
          confirmLoading={confirmLoading}
          onCancel={() => setVisible(false)}
        >
          <Input.Password
            onChange={setPassWordValue}
            placeholder="请输入密码！"
          />
        </Modal>
      </div>
    </>
  );
};

export default ChildApp;
