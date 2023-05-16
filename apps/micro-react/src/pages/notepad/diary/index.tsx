import {
  Calendar,
  Space,
  Card,
  Link,
  Modal,
  Message,
} from '@arco-design/web-react';
import { useEffect, useMemo, useState } from 'react';

import ListComp from '../components/List';
import PlanMoadl from '../components/PlanModal';
import {
  getPlanListRequest,
  getPlanTemplateRequest,
  addPlanRequest,
  updateStatusRequest,
} from '../../../api/getPlan';
import { planProps } from '../../../api/getPlan/type';
import { IWindow } from '../../../common/request/requestInterceptors';
import calculateDate from '../../../utils/calculateDate';

const PlanPage = () => {
  const defaultDate = useMemo(() => {
    const date = new Date();
    return calculateDate(date.getFullYear(), date.getMonth(), date.getDate());
  }, []);
  const [curDate, setCurDate] = useState<string>(defaultDate);
  const [planList, setPlanList] = useState<planProps[]>();
  const [planTemplate, setPlanTemplate] = useState<string[]>();

  const changeDate = (e) => {
    const selectDate = calculateDate(e.$y, e.$M, e.$D);
    setCurDate(selectDate);
  };

  const changeStatus = async (plan: planProps) => {
    const { completed, _id } = plan;
    console.log(_id);
    const rsp = await updateStatusRequest({ completed: !completed, _id });
    const list = planList.map((plan) => {
      if (plan._id === rsp.plan._id) {
        return rsp.plan;
      }
      return plan;
    });
    setPlanList(list);
  };

  const confirm = () => {
    Modal.confirm({
      title: 'Confirm',
      content: '当日没有计划，是否使用日计划模版？',
      okButtonProps: {
        status: 'success',
      },
      onOk: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const id = (window as IWindow).getStorage('userId');
            const { planTemplate } = await getPlanTemplateRequest({ id });
            console.log(planTemplate);
            const planList = planTemplate.map((plan) => {
              return {
                date: curDate,
                description: plan,
                id,
                completed: false,
              };
            });
            const { list } = await addPlanRequest({
              id,
              date: curDate,
              planList,
            });
            setPlanList(list);
            resolve(null);
          } catch (err) {
            reject(err);
          }
        }).catch((e) => {
          Message.error({
            content: 'Error occurs!',
          });
          throw e;
        });
      },
    });
  };

  useEffect(() => {
    const requestFn = async () => {
      const id = (window as IWindow).getStorage('userId');
      const { planTemplate } = await getPlanTemplateRequest({ id });
      setPlanTemplate(planTemplate);
    };
    requestFn();
  }, []);

  useEffect(() => {
    const requestFn = async () => {
      try {
        const id = (window as IWindow).getStorage('userId');
        const { planList } = await getPlanListRequest({ id, date: curDate });
        if (planList.length === 0) {
          confirm();
        } else {
          setPlanList(planList);
        }
      } catch (err) {}
    };
    requestFn();
  }, [curDate]);
  return (
    <Space wrap align="center">
      <PlanMoadl />
      <Calendar
        panel
        panelTodayBtn
        defaultValue={Date.now()}
        panelWidth={1180}
        style={{ marginRight: 50 }}
        onChange={changeDate}
      />
      <Card style={{ width: 800 }} title="Day Plan" extra={<Link>Add</Link>}>
        <ListComp list={planList} changeStatus={changeStatus} />
      </Card>
    </Space>
  );
};

export default PlanPage;
