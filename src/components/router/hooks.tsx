import { useCallback, useEffect } from 'react';

import { NavigateOptions, To, useNavigate } from 'react-router';

import { isNil } from 'lodash';

import { deepMerge } from '@/utils';

import { config } from '@/config';

import { createStoreHooks } from '../store';

import { useAuth } from '../auth/hooks';

import { getAuthRoutes, getFlatRoutes, getFullPathRoutes, getMenus, getRoutes } from './utils';
import { RouterStore } from './store';
import { NavigateTo, RouteNavigator, RouteOption } from './types';
import { AuthRedirect } from './views';
import { getDefaultRouterConfig } from './_default.config';

export const useRouterSetuped = () => {
    const ready = RouterStore((state) => state.ready);
    const auth = useAuth();
    useEffect(() => {
        if (RouterStore.getState().config.auth?.enabled) {
            const { config: routerConfig } = RouterStore.getState();
            const { routes: defaultRoutes } = deepMerge(
                getDefaultRouterConfig(),
                config().router ?? {},
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
    }, [auth]);

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
