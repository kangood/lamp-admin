import { ConfigEnv, UserConfig } from 'vite';
import merge from 'deepmerge';

import { Configure } from './types';
import { pathResolve } from './utils';
import { createPlugins } from './plugins';

export const createConfig = (params: ConfigEnv, configure?: Configure): UserConfig => {
    const isBuild = params.command === 'build';
    return merge<UserConfig>(
        {
            resolve: {
                alias: {
                    '@': pathResolve('src'),
                },
            },
            css: {
                modules: {
                    localsConvention: 'camelCaseOnly',
                },
            },
            plugins: createPlugins(isBuild),
            server: {
                proxy: {
                    '/dict': {
                        target: 'http://127.0.0.1:6001',
                        changeOrigin: true,
                    },
                    '/param': {
                        target: 'http://127.0.0.1:6001',
                        changeOrigin: true,
                    },
                    '/station': {
                        target: 'http://127.0.0.1:6001',
                        changeOrigin: true,
                    },
                    '/area': {
                        target: 'http://127.0.0.1:6001',
                        changeOrigin: true,
                    },
                    '/org': {
                        target: 'http://127.0.0.1:6001',
                        changeOrigin: true,
                    },
                    '/user': {
                        target: 'http://127.0.0.1:6001',
                        changeOrigin: true,
                    },
                },
            },
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};
