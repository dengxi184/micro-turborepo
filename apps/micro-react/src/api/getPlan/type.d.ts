export interface getPlanListOptions {
  id: string;
  date: string;
}

export interface getPlanListResponse {
  planList: planProps[];
}

export type planProps = {
  date: string;
  description: string;
  completed: boolean;
  id: string;
  _id?: string;
};

export interface getPlanTemplateOptions {
  id: string;
}

export interface getPlanTemplateResponse {
  planTemplate: string[];
}

export interface addPlansOptions {
  date: string;
  id: string;
  planList: planProps[];
}

export interface addPlansResponse {
  list: planProps[];
}

export interface updateStatusOptions {
  _id: string;
  completed?: boolean;
  description?: string;
}

export interface updateStatusResponse {
  plan: planProps;
}

export interface deletePlanOptions {
  _id: string;
}

export interface deletePlanResponse {}
