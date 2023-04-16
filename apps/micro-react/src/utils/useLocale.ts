import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context';

export interface IRecord {
  [key: string]: Record<string, string>;
}

const langMap = new Map();

// useContext获取全局翻译类型, defaultLocale返回对应的翻译对象， 通过key调用翻译
function useLocale(locale?: IRecord): Record<string, string> {
  const lang = useContext(GlobalContext).lang as string;
  const [loc, setLoc] = useState({});
  useEffect(() => {
    const ChangeLang = async () => {
      if (!langMap.has(lang)) {
        const l = await import(`../locale/${lang}`);
        langMap.set(lang, l.default);
      }
      setLoc(langMap.get(lang));
    };
    ChangeLang();
  }, [lang]);
  return (locale && locale[lang]) || loc;
}

export default useLocale;
