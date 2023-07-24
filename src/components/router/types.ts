import { ComponentType, FunctionComponent, ReactElement } from 'react';

import { DataRouteObject, NavigateOptions, Path } from 'react-router';

import { IconComponent, IconName } from '../icon/types';

/** 路由状态 */
export interface RouterState<T extends RecordAnyOrNever = RecordNever> {
    ready: boolean;
    routes: RouteOption<T>[];
    flat: RouteOption<T>[];
    menus: RouteOption<T>[];
    config: RouterConfig<T>;
}

/** 路由配置 */
export interface RouterConfig<T extends RecordAnyOrNever = RecordNever> {
    /** 跟路径,默认为 '/' */
    basename?: string;
    /** 是否启用hash模式 */
    hash?: boolean;
    /** 默认404路由页面 */
    notFound?: string | ComponentType;
    /** window对象 */
    window?: Window;
    /** 加载中组件Loading */
    loading?: FunctionComponent | false;
    /** 自定义页面包装器 */
    render?: CustomRender;
    /** 是否开启权限路由 */
    auth?: { enabled?: boolean; path?: string; page?: string | ComponentType };
    /** 路由列表配置 */
    routes: RouteOption<T>[];
}
/** 路由选项 */
export interface RouteOption<T extends RecordAnyOrNever = RecordNever>
    extends Omit<DataRouteObject, 'children' | 'Component' | 'ErrorBoundary' | 'lazy' | 'id'> {
    id: string;
    /** 默认为菜单路由，如果设置成false则不是菜单路由 */
    menu?: boolean;
    devide?: boolean;
    onlyGroup?: boolean;
    /** 路由页面,可以是组件或组件路径字符串 */
    page?: ComponentType | string | null;
    /** 异常页面,可以是组件或组件路径字符串 */
    error?: ComponentType | string | null;
    /** 自定义Render,覆盖全局自定义 */
    pageRender?: CustomRender;
    /** 自定义异常Render,覆盖全局自定义 */
    errorRender?: CustomRender;
    /** 是否为布局页面 */
    // layout?: boolean;
    /** 独立配置loadding,如果不设置则使用总配置的loading */
    loading?: FunctionComponent | false;
    /** 权限路由配置 */
    auth?: false | RouteAuth;
    meta?: MenuRouteMeta<T>;
    children?: RouteOption<T>[];
}

/** 菜单相关元元素 */
export type MenuRouteMeta<T extends RecordAnyOrNever = RecordNever> = RecordScalable<
    {
        name?: string;
        /** 是否隐藏菜单  */
        hide?: boolean;
        /** 显示图标 */
        icon?: IconComponent | IconName;
        /** <a>标签上的target,用于菜单打开外链 */
        target?: '_parent' | '_self' | '_top' | '_blank';
    },
    T
>;

/** 自定义页面加载器 */
export type CustomRender<T extends RecordAnyOrNever = RecordNever> = (
    props: RouteOption & T,
    component: RoutePage<T>,
) => ReactElement;

/** 页面组件 */
export type RoutePage<T extends RecordAnyOrNever = RecordNever> = ComponentType<
    { route: RouteComponentProps } & T
>;

/** 传给页面的参数 */
export type RouteComponentProps = Omit<RouteOption, 'component'>;

export interface RouteAuth {
    enabled?: false;
    permissions?: string[];
}

/** ********************************* 路由跳转函数 ********************************* */
interface RoutePath extends Path {
    id: string;
    name: string;
}
export type NavigateTo = string | Partial<RoutePath>;
export interface RouteNavigator {
    (to: NavigateTo, options?: NavigateOptions): void;
}
