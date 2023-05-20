type IGetStaticFileUrl<T> = (fileName: T) => T;

const getStaticFileUrl: IGetStaticFileUrl<string> = (fileName: string) => {
  return `${process.env.REACT_APP_BASE_URL}/static/files/${fileName}`;
};

export default getStaticFileUrl;
