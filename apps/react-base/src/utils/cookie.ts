export const getCookieValue = (cookieKey: string) => {
  const cookieObj = !document.cookie
    ? ''
    : document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${cookieKey}=`));
  const cookieValue = cookieObj ? cookieObj.split('=')[1] : '';
  return cookieValue;
};
