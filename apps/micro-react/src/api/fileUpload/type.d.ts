export interface uploadFileResponse {}

export interface uploadMergeOptions {
  fileName: string;
  fileHash: string;
}

export interface uploadMergeResponse {
  key: number;
  fileName: string;
  status: number | string;
}

export interface deleteFileOptions {
  fileHash: string;
}

export interface uploadRecordOptions extends deleteFileOptions {
  fileName: string;
}

export interface uploadRecordResponse {
  msg: string;
  status: number;
  sliceIndex: string[];
}

export interface deleteImgOptions {
  fileName: string;
  createAt: number;
}

export interface getImgListOptions {
  keyword: string;
  curPage: number;
  pageSize: number;
}

export interface uploadOptions {
  formData: FormData;
}

export interface uploadImgResponse {
  createAt: number;
  fileName: string;
  filePath: string;
  msg: string;
}
