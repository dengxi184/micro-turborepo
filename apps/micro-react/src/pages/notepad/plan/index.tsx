import {
  Calendar,
  Space,
  Card,
  Link,
  Modal,
  Message,
  Input,
} from '@arco-design/web-react';
import { useEffect, useMemo, useState } from 'react';

import ListComp from './components/List';
import {
  getPlanListRequest,
  getPlanTemplateRequest,
  addPlanRequest,
  updateStatusRequest,
  deletePlanRequest,
} from '../../../api/getPlan';
import { planProps } from '../../../api/getPlan/type';
import { IWindow } from '../../../common/request/requestInterceptors';
import calculateDate from './utils/calculateDate';

type IPlan = Omit<planProps, 'description'> & {
  description: React.ReactNode | string;
};

const PlanPage = () => {
  const defaultDate = useMemo(() => {
    const date = new Date();
    return calculateDate(date.getFullYear(), date.getMonth(), date.getDate());
  }, []);
  const [curDate, setCurDate] = useState<string>(defaultDate);
  const [planList, setPlanList] = useState<IPlan[]>();
  const [inputValue, setInputValue] = useState<string>();

  const changeDate = (e) => {
    const selectDate = calculateDate(e.$y, e.$M, e.$D);
    setCurDate(selectDate);
  };

  const deletePlan = async (plan: IPlan) => {
    try {
      const { _id } = plan;
      await deletePlanRequest({ _id });
      setPlanList([...planList.filter((plan) => plan._id !== _id)]);
    } catch (err) {
      console.log(err);
    }
  };

  const changeEditStatus = async (plan: IPlan) => {
    try {
      const _id = plan._id;
      if (!_id) {
        const reqPlan = Object.assign({}, plan, { description: inputValue });
        const { list } = await addPlanRequest({
          id: plan.id,
          planList: [reqPlan],
          date: curDate,
        });
        return setPlanList(list);
      }
      const editPlan = planList.find((plan) => plan._id === _id);
      const { description } = editPlan;
      const isString = typeof description === 'string';
      if (isString) {
        setInputValue(description);
        editPlan.description = (
          <Input
            style={{ width: 500 }}
            size="large"
            defaultValue={description}
            onChange={setInputValue}
          />
        );
      } else {
        const rsp = await updateStatusRequest({ description: inputValue, _id });
        editPlan.description = rsp.plan.description;
      }
      setPlanList([...planList]);
    } catch (err) {
      console.log(err);
    }
  };

  const changeStatus = async (plan: IPlan) => {
    const { completed, _id } = plan;
    const rsp = await updateStatusRequest({ completed: !completed, _id });
    const list = planList.map((plan) => {
      if (plan._id === rsp.plan._id) {
        return rsp.plan;
      }
      return plan;
    });
    setPlanList(list);
  };

  const addPlan = () => {
    const id = (window as IWindow).getStorage('userId');
    setInputValue('');
    const plan = {
      description: (
        <Input style={{ width: 500 }} size="large" onChange={setInputValue} />
      ),
      completed: false,
      date: curDate,
      id,
    };
    setPlanList([...planList, plan]);
  };

  const confirm = () => {
    setPlanList([]);
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
      <Calendar
        panel
        panelTodayBtn
        defaultValue={Date.now()}
        panelWidth={1180}
        style={{ marginRight: 50 }}
        onChange={changeDate}
      />
      <Card
        style={{ width: 800 }}
        title="Day Plan"
        extra={<Link onClick={addPlan}>Add</Link>}
      >
        <ListComp
          list={planList}
          deletePlan={deletePlan}
          changeStatus={changeStatus}
          changeEditStatus={changeEditStatus}
        />
      </Card>
    </Space>
  );
};

export default PlanPage;
