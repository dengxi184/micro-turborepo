export interface getDiaryListOptions {
  id: string;
  type: string;
  curPage: number;
  pageSize: number;
}

export interface getDiaryListResponse {
  total: number;
  data: Record<string, string>[];
}
