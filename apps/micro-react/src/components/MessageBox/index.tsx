import React from 'react';
import { Badge } from '@arco-design/web-react';

import './style/index.less';

function MessageBox({ children }: { children: React.ReactNode }) {
  return (
    <Badge count={9} dot>
      {children}
    </Badge>
  );
}

export default MessageBox;
