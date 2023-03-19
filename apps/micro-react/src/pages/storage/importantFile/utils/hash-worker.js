const hashWorker = () => {
  self.importScripts(
    'https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js',
  );
  self.onmessage = (e) => {
    const { chunkList } = e.data;
    const spark = new self.SparkMD5.ArrayBuffer();
    let count = 0;
    const loadNext = (index) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(chunkList[index].chunk);
      reader.onload = (event) => {
        count++;
        spark.append(event.target.result);
        if (count === chunkList.length) {
          self.postMessage({
            percentage: 100,
            hash: spark.end(),
          });
          self.close();
        } else {
          loadNext(count);
        }
      };
    };
    loadNext(count);
  };
};

export default hashWorker;
