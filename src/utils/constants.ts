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

/**
 * 字典值：资源类型-菜单
 */
export const RESOURCE_TYPE_MENU = '20';
/**
 * 字典值：资源类型-数据
 */
export const RESOURCE_TYPE_DATA = '60';
/**
 * 字典值：数据范围-自定义
 */
export const DATA_SCOPE_CUSTOM = '07';
/**
 * 最大查询值，用于把所有数据都查出来，不分页
 */
export const PAGE_MAX_LIMIT = 10000;
/**
 * JWT密钥
 */
export const JWT_SECRET = 'panlore';
