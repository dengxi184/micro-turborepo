const compressPic = (file: File, encoderOtp = 0.2): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const { result: src } = event.target;
      const image = new Image();
      image.src = src as string;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        // 后续考虑画布销毁 canvas限制 1000px*1000px以上无法绘制
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const canvasURL = canvas.toDataURL(file.type, encoderOtp);
        const buffer = atob(canvasURL.split(',')[1]);
        let length = buffer.length;
        const bufferArray = new Uint8Array(length);
        while (length--) {
          bufferArray[length] = buffer.charCodeAt(length);
        }
        const resultFile = new File([bufferArray], file.name, {
          type: file.type,
        });
        resolve(resultFile);
      };
    };
  });
};

export default compressPic;
