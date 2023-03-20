import { useEffect, useState } from 'react';
import { Card, Upload, Collapse, Input } from '@arco-design/web-react';
import { useDebounceFn } from 'ahooks';

import ImgGroup from './components/ImgGroup';
import { deleteImgRequest } from '../../../api/fileUpload';
import compressPic from './utils/compressPic';
import './index.less';

const CollapseItem = Collapse.Item;
const InputSearch = Input.Search;

const Scenery = () => {
  const [imgBuffList, setImgBuffList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const beforeUpload = async (file: File, fileList: File[]) => {
    const promiseList = fileList.map((file) => compressPic(file));
    const buffList = await Promise.allSettled(promiseList);
    setImgBuffList([...buffList]);
    return false;
  };
  const cancelUpload = async (file) => {
    try {
      const { uid, url } = file;
      const fileName = `${uid}.${
        url.split('/')[url.split('/').length - 1].split('.')[1]
      }`;
      deleteImgRequest({ fileName, createAt: uid });
      setFileList([...fileList.filter((imgFile) => imgFile.uid !== uid)]);
    } catch (err) {
      console.log(err, '服务器删除失败');
    }
  };
  const { run } = useDebounceFn(
    (value: string) => {
      setKeyword(value);
    },
    {
      wait: 500,
    },
  );
  useEffect(() => {
    const requestFn = async () => {
      const success = [];
      const handleFileList = [];
      for (const idx in imgBuffList) {
        try {
          const formData = new FormData();
          formData.append('file', imgBuffList[idx].value);
          const rsp = await (
            await fetch('http://localhost:3000/api/upload/upload-img', {
              method: 'POST',
              body: formData,
            })
          ).json();
          const { createAt, fileName, filePath } = rsp;
          const imgFile = {
            uid: +createAt,
            percent: 1,
            name: fileName,
            url: filePath,
            status: 'done',
          };
          handleFileList[idx] = imgFile;
          success.push(+idx);
        } catch (err) {
          const imgFile = {
            uid: Date.now(),
            percent: 0,
            name: imgBuffList[idx].value.name,
            url: '',
            status: 'fail',
          };
          handleFileList[idx] = imgFile;
        }
      }
      setFileList([...fileList, ...handleFileList]);
    };
    if (imgBuffList.length > 0) requestFn();
  }, [imgBuffList]);
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
      <Collapse accordion style={{ maxWidth: 1180 }}>
        <ImgGroup keyword={keyword} />
        <CollapseItem header="图片上传" name="1">
          <Upload
            listType="picture-list"
            multiple
            beforeUpload={beforeUpload}
            fileList={fileList}
            onRemove={cancelUpload}
          />
        </CollapseItem>
      </Collapse>
    </Card>
  );
};

export default Scenery;
