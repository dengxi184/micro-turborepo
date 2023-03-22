import { useState } from 'react';
import { Card, Collapse, Input } from '@arco-design/web-react';
import { useDebounceFn } from 'ahooks';

import ImgGroup from './components/ImgGroup';
import { ImgUpload } from './components/imgUpload';

const InputSearch = Input.Search;

const Scenery = () => {
  const [keyword, setKeyword] = useState('');

  const { run } = useDebounceFn(
    (value: string) => {
      setKeyword(value);
    },
    {
      wait: 500,
    },
  );

  return (
    <Card
      title="照片墙"
      extra={
        <InputSearch
          allowClear
          placeholder="Enter keyword to search"
          onChange={run}
          style={{ width: 350 }}
        />
      }
      bordered={false}
    >
      <Collapse className={'contentWrap'} accordion style={{ maxWidth: 1180 }}>
        <ImgGroup keyword={keyword} />
        <ImgUpload />
      </Collapse>
    </Card>
  );
};

export default Scenery;
