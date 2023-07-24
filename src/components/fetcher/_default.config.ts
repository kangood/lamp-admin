import { FetcherConfig } from './types';

export const defaultFetcherConfig = (): FetcherConfig => ({
    baseURL: '/api/',
    timeout: 10000,
    interceptors: {},
    token: null,
    cancel_repeat: true,
    swr: {},
});
