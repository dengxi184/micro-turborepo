import { useRef, useEffect } from 'react';
import { Image } from '@arco-design/web-react';

import { maxSize } from '../../contants';

export const LazyImage = ({ img, observer }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.children[0]) {
      observer.observe(ref.current);
    }
  }, [ref]);

  return (
    <Image
      ref={ref}
      width={img.scale > 1 ? maxSize : maxSize * img.scale}
      height={img.scale > 1 ? maxSize / img.scale : maxSize}
      className="img"
      data-src={img.url}
      loader={false}
    />
  );
};
