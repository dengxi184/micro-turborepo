import { supportType } from '../../contants';

export const getSupportType = (): string => {
  return supportType.reduce((pre, type) => {
    return pre + `image/${type}, `;
  }, '');
};
