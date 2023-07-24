/**
 * 屏幕尺寸类型
 */
export enum ScreenSizeType {
    XS = 'xs',
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',
    DoubleXL = '2xl',
}

export const defaultScreenConfig: { [key in `${ScreenSizeType}`]: number } = {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    '2xl': 1400,
};
