export interface getPlanListOptions {
  id: string;
  date: string;
}

export interface getPlanListResponse {
  planList: planProps[];
}

export interface planProps {
  date: string;
  description: string;
  completed: boolean;
  id: string;
  _id?: string;
}

export interface getPlanTemplateOptions {
  id: string;
}

export interface getPlanTemplateResponse {
  planTemplate: string[];
}

export interface addPlansOptions {
  date: string;
  id: number;
  planList: planProps[];
}

export interface addPlansResponse {
  list: planProps[];
}

export interface updateStatusOptions {
  _id: string;
  completed: boolean;
}

export interface updateStatusResponse {
  plan: planProps;
}
