// export interface IUpperFirstChar<T> {
//   (word:T): T
// }
export default function useUpperFirstChar(word) {
  if (typeof word !== 'string') return;
  return word[0].toUpperCase() + word.slice(1);
}
