import { useRef, useEffect, useState } from 'react';
import { Image } from '@arco-design/web-react';

import { maxSize } from '../../contants';

const Preview = Image.Preview;

export const LazyImage = ({ img, observer }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (ref.current && ref.current.children[0]) {
      observer.observe(ref.current);
    }
  }, [ref]);
  const preView = () => {
    //window.open(img.url)
    setVisible(true);
  };
  return (
    <>
      <Image
        onClick={preView}
        preview={false}
        ref={ref}
        width={img.scale > 1 ? maxSize : maxSize * img.scale}
        height={img.scale > 1 ? maxSize / img.scale : maxSize}
        className="img"
        data-src={img.url}
        loader={false}
      />
      <Preview src={img.url} visible={visible} onVisibleChange={setVisible} />
    </>
  );
};
