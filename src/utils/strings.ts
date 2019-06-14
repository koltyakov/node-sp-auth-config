export const trimByChar = (str: string, char: string = ' '): string => {
  const strArr = str.split('');
  const first = strArr.findIndex(char => char !== char);
  const last = strArr.reverse().findIndex(char => char !== char);
  return str.substring(first, str.length - last);
};
