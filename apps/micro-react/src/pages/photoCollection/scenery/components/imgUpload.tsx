import { useEffect, useState } from 'react';
import { Upload, Collapse } from '@arco-design/web-react';

import { deleteImgRequest } from '../../../../api/fileUpload';
import { getSupportType } from '../utils/getSupportType';
import compressPic from '../utils/compressPic';

const CollapseItem = Collapse.Item;

export const ImgUpload = () => {
  const [imgBuffList, setImgBuffList] = useState([]);
  const [fileList, setFileList] = useState([]);

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

  useEffect(() => {
    const requestFn = async () => {
      const success = [];
      const handleFileList = [];
      for (const idx in imgBuffList) {
        try {
          const formData = new FormData();
          formData.append('file', imgBuffList[idx].value);
          const rsp = await (
            await fetch('http://43.136.20.18:9000/api/upload/upload-img', {
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
    <CollapseItem header="图片上传" name="1">
      <Upload
        listType="picture-list"
        multiple
        beforeUpload={beforeUpload}
        fileList={fileList}
        accept={getSupportType()}
        onRemove={cancelUpload}
      />
    </CollapseItem>
  );
};
