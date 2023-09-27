import { useCallback, useEffect, useState } from 'react';

import { NavigateOptions, To, useNavigate } from 'react-router';

import { isNil } from 'lodash';

import { decodeJwt } from 'jose';

import { deepMerge } from '@/utils';

import { config } from '@/config';
import { useListMenuTree } from '@/services/menu';

import { useListRoleMenuByRoleIds } from '@/services/role-authority';

import { createStoreHooks } from '../store';

import { useAuth } from '../auth/hooks';

import { FetcherStore } from '../fetcher/store';

import {
    getAuthRoutes,
    getFlatRoutes,
    getFullPathRoutes,
    getMenus,
    getRoutes,
    traverseMenuTree,
} from './utils';
import { RouterStore } from './store';
import { NavigateTo, RouteNavigator, RouteOption } from './types';
import { AuthRedirect } from './views';
import { getDefaultRouterConfig } from './_default.config';

export const useRouterSetuped = () => {
    const ready = RouterStore((state) => state.ready);
    const auth = useAuth();
    const [roleIds, setRoleIds] = useState<number[]>([]);
    const { data: menuTree } = useListMenuTree();
    const { data: roleMenuList } = useListRoleMenuByRoleIds({ roleIds });
    useEffect(() => {
        if (RouterStore.getState().config.auth?.enabled) {
            const { config: routerConfig } = RouterStore.getState();
            // config().router是routes/index.ts的固定路由
            const fixedRouter = config().router;
            // ==========B:菜单替换成API获取的路由，并加工处理==========
            // 1.根据角色处理路由
            const { token: tokenBase64 } = FetcherStore.getState();
            if (tokenBase64) {
                // 1.1从JWT中解密，得到当前用户的角色ID数组，然后查询角色对应菜单资源
                setRoleIds(
                    (decodeJwt(tokenBase64) as any).userRoles.map((item: any) => item.role.id),
                );
            }
            const fetchRoutes: RouteOption[] = [];
            // 2.1清空固定的路由
            fixedRouter?.routes[0].children?.splice(0, fixedRouter?.routes[0].children.length);
            // 2.2递归处理菜单数据并做成路由节点，并排除角色菜单外的数据
            menuTree?.forEach((rootNode) => {
                traverseMenuTree(rootNode, fetchRoutes, roleMenuList);
            });
            // 2.3重新把处理好的路由节点push进去
            fixedRouter?.routes[0].children?.push(...fetchRoutes);
            console.log('fixedRouter', fixedRouter);
            // ==========E:菜单替换成API获取的路由，并加工处理==========
            const { routes: defaultRoutes } = deepMerge(
                getDefaultRouterConfig(),
                fixedRouter ?? {},
                'replace',
            );
            let routes = [...defaultRoutes];
            const routeIDS = routes.map(({ id }) => id);
            if (!routeIDS.find((id) => id === 'auth.login')) {
                routes.push({
                    id: 'auth.login',
                    auth: false,
                    menu: false,
                    path: routerConfig.auth?.path,
                    page: routerConfig.auth?.page,
                });
            }
            if (isNil(auth)) {
                if (!routeIDS.find((id) => id === 'auth.redirect')) {
                    routes.push({
                        id: 'auth.redirect',
                        path: '*',
                        auth: false,
                        element: <AuthRedirect loginPath={routerConfig.auth?.path} />,
                    });
                }
            } else {
                routes = routes.filter((route) => route.id !== 'auth.redirect');
            }
            RouterStore.setState((state) => {
                state.config.routes = getAuthRoutes(routes, auth);
                state.ready = false;
            });
        }
    }, [auth, menuTree, roleMenuList]);

    useEffect(() => {
        if (!ready) {
            // console.log(RouterStore.getState().config.routes);
            RouterStore.setState((state) => {
                const { routes } = state.config;
                state.menus = getMenus(getFullPathRoutes(routes));
                state.routes = getRoutes(routes);
                state.flat = getFlatRoutes(getFullPathRoutes(routes));
                state.ready = true;
            });
        }
    }, [ready]);
};

/**
 * 获取路由状态池的钩子
 */
export const useRouterStore = createStoreHooks(RouterStore);

/**
 * 路由列表操作
 */
export const useRoutesChange = () => {
    const addRoutes = useCallback(
        /** 添加路由 */
        <T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
            RouterStore.setState((state) => {
                state.config.routes = [...state.config.routes, ...items];
                state.ready = false;
            });
        },
        [],
    );
    const setRoutes = useCallback(
        /** 重置路由 */
        <T extends RecordAnyOrNever>(items: RouteOption<T>[]) => {
            RouterStore.setState((state) => {
                state.config.routes = [...items];
                state.ready = false;
            });
        },
        [],
    );
    return {
        addRoutes,
        setRoutes,
    };
};

export const useNavigator = (): RouteNavigator => {
    const flats = RouterStore(useCallback((state) => state.flat, []));
    const navigate = useNavigate();
    return useCallback(
        (to: NavigateTo, options?: NavigateOptions) => {
            let goTo: To | undefined;
            if (typeof to === 'string') goTo = to;
            else if (to.pathname) {
                goTo = { ...to };
            } else {
                const route = flats.find((item) => to.id && item.id === to.id);
                if (route && route.path) goTo = { ...to, pathname: route.path };
            }
            if (goTo) navigate(goTo, options);
        },
        [flats, navigate],
    );
};
