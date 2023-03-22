export enum UploadStatusEN {
  init = 0,
  uploading,
  done,
  err,
}

export type UploadStatusToMap = {
  [UploadStatusEN.init]: 'init';
  [UploadStatusEN.uploading]: 'uploading';
  [UploadStatusEN.done]: 'done';
  [UploadStatusEN.err]: 'err';
};

export const spaceConfig = {
  size: 'large',
  aligin: 'start',
};

export const pageSize = 16;

export const maxSize = 250;

export const supportType = ['jpg', 'png'];

export const encoderOtp = 0.2;
