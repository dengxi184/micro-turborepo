import { useState } from 'react';
import { Upload, Collapse, type UploadProps } from '@arco-design/web-react';

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

export type RequestOptions = Pick<
  UploadProps,
  'headers' | 'name' | 'data' | 'withCredentials' | 'action'
> & {
  /** 更新当前文件的上传进度 。percent: 当前上传进度百分比 */
  onProgress: (percent: number, event?: ProgressEvent) => void;
  /** 上传成功后，调用onSuccess方法，传入的response参数将会附加到当前上传文件的reponse字段上 */
  onSuccess: (response?: object) => void;
  /** 上传失败后，调用onError方法，传入的 response 参数将会附加到当前上传文件的response字段 */
  onError: (response?: object) => void;
  /** 当前上传文件 */
  file: File;
};

export const ImgUpload = () => {
  const [fileList, setFileList] = useState([]);

  const customRequest = async (option: RequestOptions) => {
    const { onProgress, onError, onSuccess, file } = option;
    const xhr = new XMLHttpRequest();
    const compressFile = await compressPic(file);
    if (xhr.upload) {
      xhr.upload.onprogress = function (event) {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(percent, 10), event);
      };
    }
    xhr.onerror = function error(e) {
      onError(e);
    };
    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return onError(xhr.response);
      }
      onSuccess(xhr.response);
    };
    const formData = new FormData();
    formData.append('file', compressFile);
    xhr.open('post', 'http://localhost:3000/api/upload/upload-img', true);
    xhr.send(formData);
    return {
      abort() {
        xhr.abort();
      },
    };
  };

  const cancelUpload = async (xhr) => {
    try {
      const { createAt, fileName } = JSON.parse(xhr.response);
      const nameSplit = fileName.split('.');
      const FName = `${createAt}.${
        nameSplit[nameSplit.length - 1].split('.')[1]
      }`;
      deleteImgRequest({ fileName: FName, createAt });
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
