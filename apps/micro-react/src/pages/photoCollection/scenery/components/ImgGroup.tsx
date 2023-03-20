import { useEffect, useState, useRef } from 'react';
import { Pagination, Space } from '@arco-design/web-react';

import { getImgListRequest } from '../../../../api/fileUpload';
import { LazyImage } from './LazyImage';
import { pageSize } from '../../contants';

export interface IImg {
  fileName: string;
  createAt: number;
  imgName: string;
  size: string;
  url: string;
  scale: number;
  _id: number;
}

const ImgGroup = ({ keyword }) => {
  const [imgList, setImgList] = useState<Array<IImg>>([]);
  const [total, setTotal] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);
  const observer = useRef(null);

  const handlePageChange = (cur: number) => {
    setCurPage(cur);
  };
  useEffect(() => {
    const requestFn = async () => {
      const { list, total } = await getImgListRequest({
        pageSize,
        curPage,
        keyword: keyword,
      });
      setImgList([...list]);
      setTotal(total);
    };
    requestFn();
  }, [keyword, curPage]);
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((item, index) => {
          if (item.intersectionRatio > 0) {
            lazy(item.target, index);
          }
        });
      },
    );
    const lazy = (dom, index) => {
      const imgDom = dom.children[0];
      if (!imgDom.src || imgDom.src !== imgDom.dataset.src) {
        console.log(`图片${index}加载成功！`);
        imgDom.src = imgDom.dataset.src;
      }
    };
    return () => {
      // 取消所有图片懒加载组件的观察
      observer.current.disconnect();
    };
  }, []);

  return (
    <>
      <div style={{ padding: 30, marginLeft: 20 }}>
        <Space
          wrap
          align={'start'}
          size={'medium'}
          style={{ height: 344.5, overflow: 'scroll' }}
        >
          {imgList.map((img) => {
            return (
              <LazyImage img={img} observer={observer.current} key={img._id} />
            );
          })}
        </Space>
        <Pagination
          onChange={handlePageChange}
          current={curPage}
          pageSize={pageSize}
          total={total}
        />
      </div>
    </>
  );
};

export default ImgGroup;
