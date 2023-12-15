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
            plugins: createPlugins(),
            server: {
                host: '0.0.0.0',
                port: 7442,
                proxy: {
                    '/api': {
                        target: 'http://127.0.0.1:7441',
                        changeOrigin: true,
                    },
                },
            },
            // 生产端口
            preview: {
                port: 7442,
            },
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};
