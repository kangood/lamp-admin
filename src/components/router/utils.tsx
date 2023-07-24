import { isNil, omit, trim } from 'lodash';

import { Suspense } from 'react';

import { DataRouteObject } from 'react-router';

import { isUrl } from '@/utils';

import { IAuth } from '../auth/type';

import { RouteOption, RouterConfig } from './types';

import { getAsyncImport } from './views';
import { RouterStore } from './store';

export const getAuthRoutes = (routes: RouteOption[], auth: IAuth | null): RouteOption[] =>
    routes
        .map((route) => {
            if (route.auth !== false && route.auth?.enabled !== false) {
                if (isNil(auth)) return [];
                if (typeof route.auth !== 'boolean' && route.auth?.permissions?.length) {
                    if (!route.auth.permissions.every((p) => auth.permissions.includes(p))) {
                        return [];
                    }
                    if (!route.children?.length) return [route];
                    return [{ ...route, children: getAuthRoutes(route.children, auth) }];
                }
            }
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []);

/**
 * 获取路由表
 * @param routes
 */
export const getRoutes = (routes: RouteOption[]): RouteOption[] =>
    routes
        .map((route) => {
            if (route.devide) return [];
            if ((!route.index && isNil(route.path)) || isUrl(route.path)) {
                return route.children?.length ? getRoutes(route.children) : [];
            }
            return [route];
        })
        .reduce((o, n) => [...o, ...n], []);

export const getMenus = (routes: RouteOption[]): RouteOption[] =>
    routes
        .map((item) => {
            if (!isNil(item.menu) && !item.menu) {
                return item.children?.length ? getMenus(item.children) : [];
            }
            return [
                { ...item, children: item.children?.length ? getMenus(item.children) : undefined },
            ];
        })
        .reduce((o, n) => [...o, ...n], []);
/**
 * 获取扁平化路由
 * @param routes
 */
export const getFlatRoutes = (routes: RouteOption[]): RouteOption[] =>
    routes
        .map((item) => {
            if (item.devide) return [];
            return item.children?.length ? [item, ...getFlatRoutes(item.children)] : [item];
        })
        .reduce((o, n) => [...o, ...n], []);

/**
 * 获取带全路径的路由
 * @param routes
 * @param parentPath
 */
export const getFullPathRoutes = (routes: RouteOption[], parentPath?: string): RouteOption[] =>
    routes
        .map((route) => {
            if (route.devide) return [];
            const item: RouteOption = { ...route };
            const pathPrefix: { parent?: string; child?: string } = {
                parent: trim(parentPath ?? '', '/').length
                    ? `/${trim(parentPath ?? '', '/')}/`
                    : '/',
                child: trim(parentPath ?? '', '/').length ? `/${trim(parentPath ?? '', '/')}` : '/',
            };
            if (route.devide || route.index) return [omit(route, ['children', 'path'])];
            if (isUrl(route.path)) {
                item.path = route.path;
            } else {
                pathPrefix.child = route.path?.length
                    ? `${pathPrefix.parent}${trim(route.path, '/')}`
                    : pathPrefix.child;
                item.path = route.onlyGroup ? undefined : pathPrefix.child;
            }
            item.children = route.children?.length
                ? getFullPathRoutes(route.children, pathPrefix.child)
                : undefined;
            if (route.onlyGroup) item.children = item.children?.length ? item.children : [];
            return [item];
        })
        .reduce((o, n) => [...o, ...n], []);

/**
 * 构建路由渲染列表
 * @param routes
 */
export const factoryRoutes = (routes: RouteOption[]) =>
    routes.map((item) => {
        const config = RouterStore.getState();
        let option: DataRouteObject = generateAsyncPage(config, item);
        const { children } = option;
        option = generateAsyncPage(config, option);
        if (!isNil(children) && children.length) {
            option.children = factoryRoutes(children);
        }
        return option;
    });

/**
 * 获取异步路由页面
 * @param config
 * @param option
 */
const generateAsyncPage = (config: RouterConfig, option: RouteOption) => {
    const item = { ...omit(option, ['Component', 'ErrorBoundary']) } as DataRouteObject;
    let fallback: JSX.Element | undefined;
    if (config.loading) fallback = <config.loading />;
    if (option.loading) fallback = <option.loading />;
    if (typeof option.page === 'string') {
        const AsyncPage = getAsyncImport({
            page: option.page as string,
        });
        if (!isNil(option.pageRender)) {
            item.Component = () => option.pageRender!(item, AsyncPage);
        } else {
            item.Component = ({ ...rest }) => (
                <Suspense fallback={fallback}>
                    <AsyncPage route={item} {...rest} />
                </Suspense>
            );
        }
    } else {
        item.Component = option.page;
    }
    if (typeof option.error === 'string') {
        const AsyncErrorPage = getAsyncImport({
            page: option.error as string,
        });
        if (!isNil(option.errorRender)) {
            item.ErrorBoundary = () => option.errorRender!(item, AsyncErrorPage);
        } else {
            item.ErrorBoundary = ({ ...rest }) => (
                <Suspense fallback={fallback}>
                    <AsyncErrorPage route={item} {...rest} />
                </Suspense>
            );
        }
    } else {
        item.ErrorBoundary = option.error;
    }
    return item as DataRouteObject;
};
