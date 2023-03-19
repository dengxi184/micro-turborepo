import React from 'react';
import { List, Avatar } from '@arco-design/web-react';

export type IDataSource = Record<string, any>;

const RenderList = ({ dataSource }: { dataSource: any[] }) => {
  return (
    <List
      style={{ width: 50 }}
      virtualListProps={{
        height: 560,
      }}
      dataSource={dataSource}
      render={(item: any, index: number) => (
        <List.Item key={index}>
          <List.Item.Meta
            avatar={<Avatar shape="square">A</Avatar>}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );
};

export default RenderList;
