export function localStorageBasePrefixVariable(variableName: string) {
  let prefix = "https://papyrus-xxdv.onrender.com/";

  if (prefix.length === 1) {
    prefix = prefix.slice(0, -1);
  }

  return `${prefix}${variableName}`;
}
