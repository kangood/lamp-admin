import type { IconFontProps as DefaultIconFontProps } from '@ant-design/icons/lib/components/IconFont';
// import type { IconProps as IconifyIconProps } from '@iconify/react';
import type { CSSProperties, FC, RefAttributes, SVGProps } from 'react';
import 'csstype';

import type { IconPrefixType, IconType } from './constants';

/**
 * 图标名称约束
 */
export type IconName = `${IconPrefixType}:${string}`;

/**
 * 组件图标的组件参数
 */
export type IconComponent = FC<BaseElementProps>;

/**
 * 图标配置
 */
export type IconConfig<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        size?: number | string;
        classes?: string[];
        style?: CSSProperties;
        prefix?: { svg?: string; iconfont?: string };
        iconfont_urls?: string | string[];
    },
    T
>;

/**
 * 图标状态
 */
export type IconState<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    Required<Omit<IconConfig, 'iconfont_urls'>> & {
        iconfont?: FC<DefaultIconFontProps<string>>;
    },
    T
>;

/**
 * 图标参数类型
 */
export type IconComputed = {
    spin?: boolean;
    rotate?: number;
    className: string[];
    style: CSSProperties;
} & (
    | {
          name: string;
          type: `${IconType}`;
          inline?: boolean;
          iconfont?: FC<DefaultIconFontProps<string>>;
      }
    | {
          component: FC<BaseElementProps>;
      }
);

/**
 * 基本图标参数
 */
export interface BaseIconProps extends Omit<BaseElementProps, 'className' | 'name' | 'inline'> {
    className?: string;
    spin?: boolean;
    rotate?: number;
}

/**
 * SVG图标参数
 */
export interface SvgProps extends BaseIconProps {
    name: IconName;
    component?: never;
    inline?: boolean;
}

/**
 * 组件图标参数
 */
export interface ComponentProps extends BaseIconProps {
    name?: never;
    component: IconComponent;
}

/**
 * 可选图标参数
 */
export type IconProps = SvgProps | ComponentProps;

type BaseElementProps = RefAttributes<HTMLSpanElement> & SVGProps<SVGSVGElement>;
