import React, { useEffect, useState } from 'react';
import { Button, Table, Progress } from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconPauseCircle,
  IconPlayCircle,
  IconDownload,
  IconDelete,
} from '@arco-design/web-react/icon';

import { GlobalState } from '../../../../store';
import uploadStatusToMap from '../../contants';
import { deleteFileRequest } from '../../../../api/fileUpload';
import { createMapWithoutSome } from '../utils/createMap';
import getStaticFileUrl from '../utils/getStaticFileUrl';
import { IUploadFileData } from '..';
function EditableTable({ uploading, setUploading }) {
  const { fileUploadList } = useSelector((state: GlobalState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    let renderList = [];
    fileUploadList.forEach((file, _) => {
      renderList.push({
        ...file,
      });
    });
    setData(renderList);
  }, [fileUploadList]);
  const [data, setData] = useState<IUploadFileData[]>([]);
  const columns = [
    {
      title: 'FileName',
      dataIndex: 'fileName',
    },
    {
      title: 'Status',
      dataIndex: 'st',
      render: (_, record) =>
        typeof record.status === 'string' ? (
          <Progress percent={+record.status} />
        ) : (
          <Button type="text" status="success">
            {uploadStatusToMap[record.status]}
          </Button>
        ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
    },
    {
      title: 'Operation',
      dataIndex: 'op',
      render: (_, record) =>
        record.status === 3 ? (
          <IconDownload onClick={() => download(record.key)} />
        ) : record.status === 2 ? (
          <IconDelete onClick={() => removeRow(record.key)} />
        ) : uploading ? (
          <IconPauseCircle onClick={() => setUploading(false)} />
        ) : (
          <IconPlayCircle onClick={() => setUploading(true)} />
        ),
    },
  ];

  const removeRow = async (key: number) => {
    try {
      const row = data.find((item) => item.key === key);
      await deleteFileRequest({ fileHash: row.fileHash });
      setData(data.filter((item) => item.key !== key));
      dispatch({
        type: 'upload-fileUploadList',
        payload: {
          fileUploadList: createMapWithoutSome(fileUploadList, [row.fileName]),
        },
      });
    } catch (err) {
      console.log(err, 63);
    }
  };

  const download = async (key: number) => {
    const { fileName } = data.find((item) => item.key === key);
    window.location.href = getStaticFileUrl(fileName);
  };

  return (
    <>
      <Table
        data={data}
        columns={columns.map((column) => column)}
        className="table-demo-editable-cell"
      />
    </>
  );
}

export default EditableTable;
