import { List, Popover } from '@arco-design/web-react';
import {
  IconCheckCircle,
  IconCloseCircle,
  IconLoading,
} from '@arco-design/web-react/icon';

import './index.less';
// <IconCloseCircle /> <IconLoading />
const ListComp = () => {
  return (
    <List
      className={`listWrap`}
      style={{ width: '100%' }}
      dataSource={[
        'Beijing Bytedance Technology Co., Ltd.',
        <>
          <IconLoading />
          <Popover
            position="right"
            content={
              <span>
                <p>Beijing Bytedance Technology Co., Ltd.................</p>
              </span>
            }
          >
            Beijing Bytedance Technology Co., Ltd.
          </Popover>
        </>,
        'Bytedance Technology Co., Ltd.',
        'Beijing Toutiao Technology Co., Ltd.',
      ]}
      render={(item, index) => <List.Item key={index}>{item}</List.Item>}
    />
  );
};

export default ListComp;
