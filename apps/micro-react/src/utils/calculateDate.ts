type ICalculateDate<T> = (y: T, m: T, d: T) => string;

const calculateDate: ICalculateDate<number> = (y, m, d) => {
  const year = y;
  const month = m + 1 >= 10 ? m + 1 : `0${m + 1}`;
  const day = d >= 10 ? d : `0${d}`;
  return year + '-' + month + '-' + day;
};

export default calculateDate;
