/**
 * SVG 컴포넌트
 */
declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

/**
 * SVG 컴포넌트 url
 */
declare module '*.svg?url' {
  const content: {
    src: string;
  };
  export default content;
}
