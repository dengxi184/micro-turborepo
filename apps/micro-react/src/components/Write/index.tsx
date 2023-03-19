import React from 'react';
import { Input, Card } from '@arco-design/web-react';

import Header from './header';
const TextArea = Input.TextArea;

// 保存功能，将草稿存进store
const Write = () => {
  return (
    <Card
      style={{ width: '40%', marginLeft: '30%' }}
      title={<Header />}
      hoverable
    >
      <TextArea
        placeholder="Please enter ..."
        style={{ minHeight: 600, width: 400 }}
      />
    </Card>
  );
};

export default Write;
