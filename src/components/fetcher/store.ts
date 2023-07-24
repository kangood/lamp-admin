import { config } from '@/config';

import { deepMerge } from '@/utils';

import { createPersistStore } from '../store';

import { FetcherConfig } from './types';
import { defaultFetcherConfig } from './_default.config';

export const FetcherStore = createPersistStore<FetcherConfig, { token?: string | null }>(
    () => deepMerge(defaultFetcherConfig(), config().fetcher ?? {}, 'replace'),
    {
        name: 'token',
        partialize: (state) => ({ token: state.token }),
    },
);
