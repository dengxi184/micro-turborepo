import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { IFileChunk } from './divideSlice';
import { CONCURRENCY_MAX } from '../../contants';
import createMap from './createMap';
import { GlobalState } from '../../../../store';
import { uploadStatus as uploadState } from '../../contants';

export interface IFileChunkReqData {
  uploaded: number;
  formData: FormData;
  signal: AbortSignal;
  index: number;
}

const useUpload = (): [
  IFileChunk[],
  number,
  (() => void)[],
  (fileChunkList: IFileChunk[]) => void,
] => {
  const [failChunkList, setFailChunkList] = useState<IFileChunk[]>([]);
  const [controllerList, setControllerList] = useState<(() => void)[]>([]);
  const [uploadStatus, setUploadStatus] = useState<number>(0);
  const [fileChunkListReqData, setFileChunkListReqData] = useState<
    IFileChunkReqData[]
  >([]);

  const { fileUploadList } = useSelector((state: GlobalState) => state);
  const dispatch = useDispatch();

  const curFile = useMemo(() => {
    const file = fileUploadList.entries().next().value;
    return file && file.length ? fileUploadList.entries().next().value[1] : {};
  }, [fileUploadList]);

  const requestFn = (
    formData: FormData,
    signal: AbortSignal,
    index: number,
  ) => {
    fileChunkListReqData[index].uploaded = uploadState.uploading;
    setFileChunkListReqData([...fileChunkListReqData]);
    const task = fetch('http://43.136.20.18:9000/api/upload/upload-file', {
      method: 'POST',
      body: formData,
      signal,
    });
    task
      .then(() => {
        const filterData = fileUploadList.get(curFile.fileName);
        const successCount =
          fileChunkListReqData.filter(
            (chunkReq) => chunkReq.uploaded === uploadState.success,
          ).length + 1;
        const percentage = `${Math.max(
          Math.ceil((successCount / fileChunkListReqData.length) * 100),
          +filterData.status,
        )}`;
        dispatch({
          type: 'upload-fileUploadList',
          payload: {
            fileUploadList: createMap(
              fileUploadList,
              filterData.fileName,
              Object.assign(filterData, {
                status: percentage,
                sliceIndex: [...filterData.sliceIndex, formData.get('hash')],
              }),
            ),
          },
        });
        fileChunkListReqData[index].uploaded = uploadState.success;
        setFileChunkListReqData([...fileChunkListReqData]);
      })
      .catch(() => {
        fileChunkListReqData[index].uploaded = uploadState.faild;
        setFileChunkListReqData([...fileChunkListReqData]);
      });
  };

  // 处理fileChunk
  const uploadFileChunks = async function (fileChunkList: IFileChunk[]) {
    const controList = [];
    const fileChunkListReqData = fileChunkList.map(({ chunk, hash }, index) => {
      const formData = new FormData();
      const controller = new AbortController();
      const abort = () => {
        controller.abort();
      };
      controList.push(abort);
      formData.append('fileName', curFile.fileName);
      formData.append('hash', hash);
      formData.append('chunk', chunk);
      return {
        formData,
        signal: controller.signal,
        uploaded: uploadState.wating,
        index,
      };
    });
    setFileChunkListReqData([...fileChunkListReqData]);
    setControllerList([...controList]);
  };

  useEffect(() => {
    const uploadingCount = fileChunkListReqData.filter(
      (chunkreq) => chunkreq.uploaded === uploadState.uploading,
    ).length;
    const waitingCount = fileChunkListReqData.filter(
      (chunkreq) => chunkreq.uploaded === uploadState.wating,
    ).length;
    if (waitingCount === 0 && uploadingCount === 0) {
      const reqFailChunkList = fileChunkListReqData
        .filter((chunkreq) => chunkreq.uploaded === uploadState.faild)
        .map(({ formData }) => {
          return {
            hash: formData.get('hash') as string,
            chunk: formData.get('chunk') as Blob,
          };
        });
      setFailChunkList([...reqFailChunkList]);
      setUploadStatus(uploadStatus + 1);
      return;
    }
    if (uploadingCount < CONCURRENCY_MAX) {
      fileChunkListReqData.every((chunkReq) => {
        if (chunkReq.uploaded === uploadState.wating) {
          const { formData, signal, index } = chunkReq;
          requestFn(formData, signal, index);
          return false;
        }
        return true;
      });
    }
  }, [fileChunkListReqData]);

  return [failChunkList, uploadStatus, controllerList, uploadFileChunks];
};

export default useUpload;
