import React, { useEffect, useState } from 'react';
import { Upload } from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';

import { uploadMergeRequest, fileUploadRecord } from '../../../api/fileUpload';
import { getFileListRequest } from '../../../api/getFileList';
import { uploadMergeResponse } from '../../../api/fileUpload/type';
import EditableTable from './components/EditableTable';
import { GlobalState } from '../../../store';
import hashWorker from './utils/hash-worker';
import WorkerBuilder from './utils/worker-build';
import createMap from './utils/createMap';
import divideSlice, { IFileChunk } from './utils/divideSlice';
import useUpload from './utils/useUpload';
import { uploadStatus as fileStatus } from '../contants';
import { Message } from '@arco-design/web-react';

export interface IUploadFileData extends uploadMergeResponse {
  size: string;
  fileHash: string;
  sliceIndex: string[];
}

const ImportantFile = () => {
  const [curFile, setCurFile] = useState<File>();
  const [chunkList, setChunkList] = useState<IFileChunk[]>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [failChunkList, uploadStatus, controllerList, uploadFileChunks] =
    useUpload();
  const { fileUploadList } = useSelector((state: GlobalState) => state);
  const dispatch = useDispatch();

  const beforeUpload = async (file: File, fileList: File[]) => {
    const chunkList = divideSlice(file);
    const gap = chunkList.length >= 20 ? Math.ceil(chunkList.length / 20) : 1;
    const filterChunkList = chunkList.filter((_, index) => index % gap === 0);
    const hash = await calculateHash(filterChunkList);
    const { sliceIndex, status } = await fileUploadRecord({
      fileName: file.name,
      fileHash: hash,
    });
    if (status === fileStatus.exit) {
      return Message.info({
        content: '服务器已存在该文件，请勿重复上传！',
        duration: 1000,
      });
    }
    setCurFile(file);
    setChunkList(chunkList);
    dispatch({
      type: 'upload-fileUploadList',
      payload: {
        fileUploadList: createMap(fileUploadList, file.name, {
          key: Date.now(),
          fileName: file.name,
          fileHash: hash,
          status: `${Math.ceil((sliceIndex.length / chunkList.length) * 100)}`,
          size: '',
          sliceIndex,
        }),
      },
    });
    return true;
  };

  const calculateHash = (chunkList: IFileChunk[]): Promise<string> => {
    return new Promise((resolve) => {
      const woker = new WorkerBuilder(hashWorker);
      woker.postMessage({ chunkList: chunkList });
      woker.onmessage = (e) => {
        if (e.data.hash) {
          resolve(e.data.hash);
        }
      };
    });
  };

  const upload = () => {
    if (!curFile) return;
    setUploading(true);
  };

  const mergeFileChunks = async () => {
    const filterData = fileUploadList.get(curFile.name);
    const rsp = await uploadMergeRequest({
      fileName: filterData.fileName,
      fileHash: filterData.fileHash,
    });
    setUploading(false);
    dispatch({
      type: 'upload-fileUploadList',
      payload: {
        fileUploadList: createMap(
          fileUploadList,
          filterData.fileName,
          Object.assign(filterData, rsp),
        ),
      },
    });
  };

  useEffect(() => {
    const requestFn = async () => {
      try {
        const fileList = await getFileListRequest();
        const list = fileList.reduce((pre, cur) => {
          return createMap(pre, cur.fileName, cur as IUploadFileData);
        }, fileUploadList);
        dispatch({
          type: 'upload-fileUploadList',
          payload: {
            fileUploadList: list,
          },
        });
      } catch (err) {
        console.log(err);
      }
    };
    requestFn();
  }, []);

  useEffect(() => {
    if (!uploading) {
      controllerList.forEach((controller) => controller());
      return;
    }
    const file = fileUploadList.get(curFile.name);
    const filterChunkList = chunkList.filter(
      (chunk) => !file.sliceIndex?.includes(String(chunk.hash)),
    );
    uploadFileChunks(filterChunkList);
  }, [uploading]);

  useEffect(() => {
    if (!uploading) return;
    if (uploadStatus < 3 && failChunkList.length > 0) {
      uploadFileChunks(failChunkList);
    } else {
      mergeFileChunks();
    }
  }, [uploadStatus]);

  return (
    <>
      <Upload
        showUploadList={false}
        customRequest={upload}
        beforeUpload={beforeUpload}
      />
      <EditableTable
        uploading={uploading}
        setUploading={(state) => setUploading(state)}
      />
    </>
  );
};

export default ImportantFile;
