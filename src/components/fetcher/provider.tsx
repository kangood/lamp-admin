/**
 * Author         : pincman
 * HomePage       : https://pincman.com
 * Support        : support@pincman.com
 * Created_at     : 2021-12-25 07:26:27 +0800
 * Updated_at     : 2022-01-10 10:15:56 +0800
 * Path           : /src/components/Fetcher/provider.tsx
 * Description    : SWR包装器
 * LastEditors    : pincman
 * Copyright 2022 pincman, All Rights Reserved.
 *
 */
import { FC, ReactNode, useMemo } from 'react';
import { SWRConfig } from 'swr';

import { AxiosRequestConfig } from 'axios';

import { deepMerge } from '@/utils';

import { useFetcher } from './hooks';

import { FetcherStore } from './store';
import { createRequest } from './utils';
import { FetcherContext } from './constants';

const FetcherProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { swr, ...config } = FetcherStore((state) => state);
    const fetcher = useMemo(() => createRequest(config), [config]);
    return <FetcherContext.Provider value={fetcher}>{children}</FetcherContext.Provider>;
};
/**
 * SWR包装器,如果要使用swr功能请使用此组件包裹根组件
 * @param props
 */
const SWRProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const swr = FetcherStore((state) => state.swr);
    const fetcher = useFetcher();
    const config = useMemo(
        () => ({
            ...swr,
            fetcher: async (
                resource: string | AxiosRequestConfig,
                options?: AxiosRequestConfig,
            ) => {
                let requestConfig: AxiosRequestConfig = options ?? {};
                if (typeof resource === 'string') requestConfig.url = resource;
                else requestConfig = deepMerge(requestConfig, resource, 'replace');
                return fetcher.request({ ...requestConfig, method: 'get' });
            },
        }),
        [fetcher],
    );
    return <SWRConfig value={config}>{children}</SWRConfig>;
};

export const Fetcher: FC<{ children: ReactNode }> = ({ children }) => (
    <FetcherProvider>
        <SWRProvider>{children}</SWRProvider>
    </FetcherProvider>
);
