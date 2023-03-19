export enum uploadStatus {
  faild = 0,
  wating,
  success,
  exit,
  uploading,
}

const uploadStatusToMap = {
  [uploadStatus.faild]: '上传失败',
  [uploadStatus.wating]: '正在上传',
  [uploadStatus.success]: '上传成功',
  [uploadStatus.exit]: '存在于服务器',
};

export const CONCURRENCY_MAX = 5;

export const SLICE_SIZE = 1024 * 1024 * 5;

export default uploadStatusToMap;
