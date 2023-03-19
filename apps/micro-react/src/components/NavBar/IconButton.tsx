import React, { forwardRef } from 'react';
import { Button } from '@arco-design/web-react';
import './style/icon-button.less';

function IconButton(props: any, ref: any) {
  const { icon, className, ...rest } = props;

  return (
    <Button
      ref={ref}
      icon={icon}
      shape="circle"
      type="secondary"
      className={`icon-button ${className}`}
      {...rest}
    />
  );
}

export default forwardRef(IconButton);
