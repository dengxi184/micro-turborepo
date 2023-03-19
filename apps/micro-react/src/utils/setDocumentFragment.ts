import React from 'react';
import { isString } from './is';

function setDocumentFragment(ele: string | Node, count: number) {
  const ReactNode = isString(ele)
    ? document.createElement(ele as string)
    : (ele as Node);
  const fragment = document.createDocumentFragment();
  new Array(count).fill(null).map((_) => fragment.appendChild(ReactNode));
  return fragment;
}

export default setDocumentFragment;
