'use client';

import * as icons from '@/assets/index.js';

export const IconName = Object.fromEntries(Object.keys(icons).map((key) => [key, key])) as Record<
  keyof typeof icons,
  string
>;

export type IconName = keyof typeof IconName;

export interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  /** icon 이름 */
  icon: IconName;
  /** icon 사이즈 */
  size?: number;
}

/**
 * core Icon UI
 *
 * svgr/webpack을 사용한 svg 컴포넌트
 */
export const Icon = ({ icon, size = 16, ...rest }: IconProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const SVGIcon = icons[icon];

  return <SVGIcon width={size} height={size} {...rest} />;
};
