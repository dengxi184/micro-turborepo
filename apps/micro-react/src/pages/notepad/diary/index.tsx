import { Calendar, Space, Card, Link } from '@arco-design/web-react';

import ListComp from '../components/List';
import PlanMoadl from '../components/PlanModal';

const PlanPage = () => {
  return (
    <Space wrap align="center">
      <PlanMoadl />
      <Calendar
        panel
        panelTodayBtn
        panelWidth={1180}
        style={{ marginRight: 50 }}
        onChange={(a) => console.log(a)}
      />
      <Card style={{ width: 800 }} title="Day Plan" extra={<Link>Add</Link>}>
        <ListComp />
      </Card>
    </Space>
  );
};

export default PlanPage;
