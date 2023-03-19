export interface loginOptions {
  account: string;
  password: string;
}

export interface loginResponse {
  message?: string;
  token?: string;
  id?: string;
  role: string;
}
