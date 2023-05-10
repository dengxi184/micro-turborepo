import { useEffect, useState } from 'react';
import { Upload, Collapse } from '@arco-design/web-react';

import { deleteImgRequest } from '../../../../api/fileUpload';
import { getSupportType } from '../utils/getSupportType';
import compressPic from '../utils/compressPic';

const CollapseItem = Collapse.Item;

export interface IImgFile {
  uid: number;
  percent: number;
  name: string;
  url: string;
  status: string;
}

export const ImgUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [curFile, setCurFile] = useState<IImgFile>();

  const beforeUpload = async (file: File) => {
    try {
      const compressFile = await compressPic(file);
      const formData = new FormData();
      formData.append('file', compressFile);
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
      setCurFile(imgFile);
    } catch (err) {
      console.log('上传失败', err);
    }
    return false;
  };

  const cancelUpload = async (file) => {
    try {
      console.log(file, fileList);
      const { uid, url } = file;
      const urlSplit = url.split('/');
      const fileName = `${uid}.${urlSplit[urlSplit.length - 1].split('.')[1]}`;
      deleteImgRequest({ fileName, createAt: uid });
      setFileList([
        ...fileList.filter((imgFile) => imgFile && imgFile.uid !== uid),
      ]);
    } catch (err) {
      console.log(err, '服务器删除失败');
    }
  };

  useEffect(() => {
    setFileList([...fileList, curFile]);
  }, [curFile]);

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
