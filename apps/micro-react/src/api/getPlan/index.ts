import { get, post, del } from '../../common/request';
import {
  getPlanListResponse,
  getPlanListOptions,
  getPlanTemplateOptions,
  getPlanTemplateResponse,
  addPlansOptions,
  addPlansResponse,
  updateStatusOptions,
  updateStatusResponse,
  deletePlanOptions,
  deletePlanResponse,
} from './type';

const url = 'api/plan';
export const getPlanListRequest = async (options: getPlanListOptions) => {
  const { id, date } = options;
  return get<getPlanListResponse>({
    input: `${url}/get-plans?id=${id}&date=${date}`,
    init: {},
  });
};

export const getPlanTemplateRequest = async (
  options: getPlanTemplateOptions,
) => {
  const { id } = options;
  return get<getPlanTemplateResponse>({
    input: `${url}/get-plan-template?id=${id}`,
    init: {},
  });
};

export const addPlanRequest = async (options: addPlansOptions) => {
  return post<addPlansResponse>({
    input: `${url}/add-plans`,
    init: { body: { ...options } },
  });
};

export const updateStatusRequest = async (options: updateStatusOptions) => {
  return post<updateStatusResponse>({
    input: `${url}/update-plan`,
    init: { body: { ...options } },
  });
};

export const deletePlanRequest = async (options: deletePlanOptions) => {
  return del<deletePlanResponse>({
    input: `${url}/del-plan`,
    init: { body: { ...options } },
  });
};
