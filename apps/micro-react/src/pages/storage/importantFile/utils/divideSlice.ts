import { SLICE_SIZE } from '../../contants';

export interface IFileChunk {
  hash: string;
  chunk: Blob;
}

const divideSlice = (file: File): IFileChunk[] => {
  if (!file) return;
  let fileChunks = [];
  let index = 0,
    cur = 0; //切片序号
  while (cur < file.size) {
    fileChunks.push({
      hash: index++,
      chunk: file.slice(cur, cur + SLICE_SIZE),
    });
    cur += SLICE_SIZE;
  }
  return fileChunks;
};

export default divideSlice;
