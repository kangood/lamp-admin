import { deepMerge } from '@/utils';

import { config } from '@/config';

import { createStore } from '../store';

import { RouterState } from './types';
import { getDefaultRouterConfig } from './_default.config';

/**
 * 路由状态池
 */
export const RouterStore = createStore<RouterState>(() => ({
    ready: false,
    routes: [],
    menus: [],
    flat: [],
    config: deepMerge(getDefaultRouterConfig(), config().router ?? {}, 'replace'),
}));
