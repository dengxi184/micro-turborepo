import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from '@arco-design/web-react';
import { IconUser, IconLock } from '@arco-design/web-react/icon';

import { loginRequest } from '../../api/login';
import { getStorage, removeStorage, setStorage } from '../../storage';
import { loginResponse } from '../../api/login/type';
import './index.less';

const FormItem = Form.Item;

export interface Iprops {
  setToken: (token: string) => void;
}

export interface IEventTarget extends EventTarget {
  type: string;
  value: string;
}

const Login = ({ setToken }: Iprops) => {
  const [form] = Form.useForm();
  const [rmbState, setRmbState] = useState(true);
  const defaultAccount = getStorage('account') ?? '',
    defaultPassword = getStorage('password') ?? '';
  const [accountValue, setAccountValue] = useState<string>(defaultAccount);
  const [passwordValue, setPasswordValue] = useState<string>(defaultPassword);
  const login = async () => {
    try {
      const account = (accountValue ?? defaultAccount) as string;
      const password = (passwordValue ?? defaultPassword) as string;
      const { token, id } = (await loginRequest({
        account,
        password,
      })) as loginResponse;
      if (!token) {
        removeStorage('token');
        //removeStorage('userRole')
        throw new Error();
      }
      // 退出只读状态
      const userState = getStorage('user-state');
      userState && removeStorage('user-state');
      setStorage('token', token!.toString(), 60, true);
      //setStorage('userRole', role, 60, true)
      setStorage('userId', id!.toString());
      setToken(token as string);
    } catch (err) {
      console.log(err);
    } finally {
      setStorage('account', rmbState ? accountValue : '');
      setStorage('password', rmbState ? passwordValue : '');
    }
  };
  const skipLogin = () => {
    setStorage('user-state', 'readOnly');
    setToken('skip login');
  };
  const changeRmbState = (checked: boolean) => {
    // 清除本地储存的账号密码
    if (!checked) {
      removeStorage('account');
      removeStorage('password');
    }
    setRmbState(checked);
  };
  return (
    <Form
      form={form}
      className={'login'}
      style={{ width: 600 }}
      autoComplete="off"
    >
      <FormItem required field="account" label={<IconUser />}>
        <Input
          defaultValue={defaultAccount}
          onChange={(value: string) => setAccountValue(value)}
          placeholder="Enter keyword to search"
        />
        <></>
      </FormItem>
      <FormItem field="password" required label={<IconLock />}>
        <Input.Password
          defaultValue={defaultPassword}
          onChange={(value: string) => setPasswordValue(value)}
          placeholder="please enter your post..."
        />
        <></>
      </FormItem>
      <div className={'login-footer'}>
        <FormItem>
          <Checkbox defaultChecked onChange={changeRmbState}>
            Remember
          </Checkbox>
        </FormItem>
        <FormItem>
          <Button onClick={login} htmlType="submit" type="primary">
            Submit
          </Button>
        </FormItem>
        <FormItem>
          <Button type="text" onClick={skipLogin}>
            Skip
          </Button>
        </FormItem>
      </div>
    </Form>
  );
};

export default Login;
