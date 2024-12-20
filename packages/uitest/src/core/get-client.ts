/**
 * 좋은 함수
 */
export const getClient = () => {
  return typeof window !== 'undefined' ? true : false;
};
