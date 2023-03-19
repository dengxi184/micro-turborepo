import { useContext } from 'react';
import { GlobalContext } from '../context';
import defaultLocale from '../locale';

export interface IRecord {
  [key: string]: Record<string, string>;
}

// useContext获取全局翻译类型, defaultLocale返回对应的翻译对象， 通过key调用翻译
function useLocale(locale?: IRecord): Record<string, string> {
  const lang = useContext(GlobalContext).lang as string;

  return (locale || defaultLocale)[lang] || {};
}

export default useLocale;
