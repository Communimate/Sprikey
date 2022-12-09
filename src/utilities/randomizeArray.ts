export function randomizeArray<T>(array: T[]): T[] {
  const randomizedArray = [ ...array ];

  for (let index = 0; index < array.length; ++index) {
    const randomIndex = Math.floor(Math.random() * array.length);
    [ randomizedArray[index], randomizedArray[randomIndex] ] = [ randomizedArray[randomIndex]!, randomizedArray[index]! ];
  }

  return randomizedArray;
}
