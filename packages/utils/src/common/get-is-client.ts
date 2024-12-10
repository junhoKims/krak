/**
 * ### `getIsClient`
 *
 * 클라이언트 환경 여부 반환
 */ 
export const getIsClient = () => {
  console.error('krak')
  console.warn('krak');
  const a = 4;


  
  return typeof globalThis.window !== "undefined"
};
