import qs from 'query-string';
import { isSSR } from './is';

export type ParamsType = Record<string, any>;

export default function getUrlParams(): ParamsType {
  const params = qs.parseUrl(!isSSR ? window.location.href : '').query;
  const returnParams: ParamsType = {};
  Object.keys(params).forEach((p) => {
    if (params[p] === 'true') {
      returnParams[p] = true;
    }
    if (params[p] === 'false') {
      returnParams[p] = false;
    }
  });
  return returnParams;
}
