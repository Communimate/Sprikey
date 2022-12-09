function replaceCallback(wholeMatch: string, firstChar: unknown, restWord: unknown): string {
  return typeof firstChar === "string"
    ? `${firstChar.toUpperCase()}${typeof restWord === "string" ? restWord : ""}`
    : wholeMatch;
}

export function capitalize(word: string): string {
  return word.replace(/^(\w)(\w*)/ui, replaceCallback);
}
