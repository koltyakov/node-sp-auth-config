export const trimByChar = (str: string, char = ' '): string => {
  const strArr = str.split('');
  const first = strArr.findIndex((ch) => ch !== char);
  const last = strArr.reverse().findIndex((ch) => ch !== char);
  return str.substring(first, str.length - last);
};
