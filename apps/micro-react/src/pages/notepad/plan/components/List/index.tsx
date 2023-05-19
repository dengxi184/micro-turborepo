import { List, Avatar } from '@arco-design/web-react';
import { IconCheckCircle } from '@arco-design/web-react/icon';
import { planProps } from '../../../../../api/getPlan/type';

const ListComp = ({ deletePlan, changeEditStatus, changeStatus, list }) => {
  const render = (item: planProps, index) => (
    <List.Item
      key={item._id ?? index}
      actions={[
        <span
          className="list-demo-actions-button"
          onClick={() => changeEditStatus(item)}
        >
          {typeof item.description === 'string' ? 'Edit' : 'done'}
        </span>,
        <span
          className="list-demo-actions-button"
          onClick={() => deletePlan(item)}
        >
          Delete
        </span>,
      ]}
    >
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
        render={render.bind(null)}
      />
    </>
  );
};

export default ListComp;
