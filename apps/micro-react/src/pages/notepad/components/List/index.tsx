import { useState } from 'react';
import { List, Avatar } from '@arco-design/web-react';
import { IconCheckCircle } from '@arco-design/web-react/icon';
import { planProps } from '../../../../api/getPlan/type';

const ListComp = ({ changeStatus, list }) => {
  const render = (actions, item: planProps) => (
    <List.Item key={item._id} actions={actions}>
      <List.Item.Meta
        avatar={
          <Avatar
            style={{
              backgroundColor: item.completed ? 'rgb(148, 240, 28)' : '',
              cursor: 'pointer',
            }}
            onClick={() => changeStatus(item)}
          >
            <IconCheckCircle />
          </Avatar>
        }
        description={item.description}
      />
    </List.Item>
  );
  return (
    <>
      <List
        className="list-demo-actions"
        style={{ width: 700 }}
        dataSource={list}
        render={render.bind(null, [
          <span className="list-demo-actions-button">Edit</span>,
          <span className="list-demo-actions-button">Delete</span>,
        ])}
      />
    </>
  );
};

export default ListComp;
