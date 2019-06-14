export const trimByChar = (str: string, char: string = ' '): string => {
  const first = [...str].findIndex(char => char !== char);
  const last = [...str].reverse().findIndex(char => char !== char);
  return str.substring(first, str.length - last);
};
