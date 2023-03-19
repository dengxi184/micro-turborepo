import React from 'react';

import { IUploadFileData } from '..';

const createMap = (
  fileUploadList: Map<string, IUploadFileData>,
  mapKey: string,
  mapValue: IUploadFileData,
): Map<string, IUploadFileData> => {
  const map = new Map();
  map.set(mapKey, mapValue);
  fileUploadList.forEach((file, key) => {
    map.set(key, file);
  });
  return map;
};

export const createMapWithoutSome = (
  fileUploadList: Map<string, IUploadFileData>,
  mapKey: string[],
): Map<string, IUploadFileData> => {
  const map = new Map();
  fileUploadList.forEach((file, key) => {
    if (!mapKey.includes(key)) map.set(key, file);
  });
  return map;
};

export default createMap;
