import { useState } from 'react';
import { Upload, Collapse, type UploadProps } from '@arco-design/web-react';

import {
  deleteImgRequest,
  uploadImgLimitRequest,
} from '../../../../api/fileUpload';
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

export type RequestOptions = Pick<
  UploadProps,
  'headers' | 'name' | 'data' | 'withCredentials' | 'action'
> & {
  onProgress: (percent: number, event?: ProgressEvent) => void;
  onSuccess: (response?: object) => void;
  onError: (response?: object) => void;
  file: File;
};

export const ImgUpload = () => {
  const [fileList, setFileList] = useState([]);

  const customRequest = async (option: RequestOptions) => {
    const { onError, onSuccess, file } = option;
    try {
      const compressFile = await compressPic(file);
      const formData = new FormData();
      formData.append('file', compressFile);
      const rsp = await uploadImgLimitRequest(formData);
      onSuccess(rsp);
    } catch (err) {
      onError(err);
    }
  };

  const cancelUpload = async (xhr) => {
    try {
      const { createAt, fileName } = JSON.parse(xhr.response);
      const nameSplit = fileName.split('.');
      const FName = `${createAt}.${
        nameSplit[nameSplit.length - 1].split('.')[1]
      }`;
      await deleteImgRequest({ fileName: FName, createAt });
      setFileList([
        ...fileList.filter((imgFile) => imgFile && imgFile.uid !== xhr.uid),
      ]);
    } catch (err) {
      console.log(err, '服务器删除失败');
    }
  };

  return (
    <CollapseItem header="图片上传" name="1">
      <Upload
        listType="picture-list"
        multiple
        fileList={fileList}
        onChange={setFileList}
        customRequest={customRequest}
        accept={getSupportType()}
        onRemove={cancelUpload}
      />
    </CollapseItem>
  );
};
