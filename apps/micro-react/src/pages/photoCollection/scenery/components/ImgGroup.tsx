import { useEffect, useState } from 'react';
import { Pagination, Space, Image } from '@arco-design/web-react';

import { getImgListRequest } from '../../../../api/fileUpload';
import { pageSize } from '../../contants';
import { maxSize } from '../../contants';

const ImgGroup = ({ keyword }) => {
  const [imgList, setImgList] = useState<Array<any>>([]);
  const [total, setTotal] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);

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
              <Image
                width={img.scale > 1 ? maxSize : maxSize * img.scale}
                height={img.scale > 1 ? maxSize / img.scale : maxSize}
                key={img._id}
                src={img.url}
              />
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
