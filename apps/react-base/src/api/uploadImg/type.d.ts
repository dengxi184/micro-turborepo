export interface uploadImgOptions {
  formData: FormData;
}

export interface uploadImgResponse {
  createAt: number;
  fileName: string;
  filePath: string;
  msg: string;
}
