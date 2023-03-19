import React from 'react';
import { Input, DatePicker } from '@arco-design/web-react';
import { IconArrowLeft } from '@arco-design/web-react/icon';

const Header = () => {
  return (
    <div style={{ padding: 20 }}>
      <Input.Group compact>
        <IconArrowLeft style={{ width: '8%' }} />
        <Input
          style={{ width: '60%' }}
          allowClear
          placeholder="Please Enter Your Title"
        />
        <DatePicker defaultValue={Date.now()} style={{ width: '35%' }} />
      </Input.Group>
    </div>
  );
};
export default Header;
