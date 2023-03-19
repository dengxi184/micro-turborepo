import React, { useEffect, useState } from 'react';

import { getDiaryListRequest } from '../../../api/getDiary';
import RenderList from '../../../components/List';
import Write from '../../../components/Write';
import { IDataSource } from '../../../components/List';
import './index.css';

export type IWindow = Window &
  typeof globalThis & { getStorage: (key: string) => any };

const Diary = () => {
  const [total, setTotal] = useState<number>(0);
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [diaryList, setDiaryList] = useState<IDataSource>([]);
  const [type, setType] = useState<string>();
  useEffect(() => {
    // 取第一页数据 确定total
    try {
      const listData = new Array(10000).fill(null).map((_, index) => {
        const prefix = `0000${index}`.slice(-5);
        return {
          title: 'Beijing Bytedance Technology Co., Ltd.',
          description: `(${prefix}) Beijing ByteDance Technology Co., Ltd. is an enterprise located in China.`,
        };
      });
      setDiaryList(listData);
      const id = (window as IWindow).getStorage('userId');
      const requestFn = async () => {
        // 后面用redux-thunk存进store
        const rsp = await getDiaryListRequest({
          id,
          curPage,
          type: '',
          pageSize,
        });
        setDiaryList(rsp.data);
        setTotal(rsp.total);
      };
      requestFn();
    } catch (err) {}
  }, []);
  return (
    <>
      {/* <RenderList dataSource={diaryList}/> */}
      <Write />
    </>
  );
};

export default Diary;
