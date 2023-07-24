import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { enableMapSet, produce } from 'immer';

import { isNil, omit } from 'lodash';

import { deepMerge } from '@/utils';

import type { FetcherConfig, FetchOption } from './types';
import { FetcherStore } from './store';

enableMapSet();
const customOptions: Array<keyof FetchOption> = ['token', 'interceptors', 'cancel_repeat'];
/**
 * 创建请求对象
 * @param config Axios配置
 * @param options 自定义选项
 */
export const createRequest: (config?: Omit<FetcherConfig, 'swr'>) => AxiosInstance = (config) => {
    const configed: FetcherConfig = deepMerge(FetcherStore.getState(), config ?? {}, 'replace');
    // 重复请求[key:cancel]映射
    let pendingMap = new Map();
    const instance = axios.create(omit(configed, customOptions));
    if (configed.interceptors?.request) {
        configed.interceptors.request(instance.interceptors.request);
    } else {
        instance.interceptors.request.use(
            (params) => {
                // 如果处于请求状态则清除前一次请求
                pendingMap = removePending(params, pendingMap);
                // 如果开启"禁止重复请求"则添加当前请求的取消函数到映射对象
                if (configed.cancel_repeat) pendingMap = addPending(params, pendingMap);
                // 添加token
                if (configed.token && typeof window !== 'undefined') {
                    params.headers.set('Authorization', configed.token);
                }
                return params;
            },
            (error) => {
                if (import.meta.env.DEV) console.log(error);
                return Promise.reject(error);
            },
        );
    }
    if (configed.interceptors?.response) {
        configed.interceptors.response(instance.interceptors.response);
    } else {
        instance.interceptors.response.use(
            async (response) => {
                const resToken = response.headers.authorization;
                // 如果返回头中带有token并且和当前token不同则储存新的token
                if (resToken && configed.token !== resToken) {
                    FetcherStore.setState((state) => {
                        state.token = resToken;
                    });
                }
                // 删除映射对象中的取消函数并结束当前请求
                pendingMap = removePending(response.config, pendingMap);
                return response;
            },
            async (error) => {
                pendingMap = error.config && removePending(error.config, pendingMap);
                if (import.meta.env.DEV) console.log(error);
                if (!isNil(error.response))
                    switch (error.response.status) {
                        case 401: {
                            FetcherStore.setState((state) => {
                                state.token = null;
                            });
                            break;
                        }
                        default:
                            break;
                    }
                return Promise.reject(error);
            },
        );
    }

    return instance;
};

/**
 * 生成重复请求控制对象的key
 * @param config axios请求配置
 */
function getPendingKey(config: AxiosRequestConfig): string {
    const { url, method, params } = config;
    let { data } = config;
    if (typeof data === 'string') data = JSON.parse(data);
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
}
/**
 * 添加一对重复请求取消函数的key-函数映射
 * @param config axios请求配置
 * @param maps 映射对象
 */
const addPending = (config: InternalAxiosRequestConfig, maps: Map<string, AbortController>) =>
    produce(maps, (state) => {
        const pendingKey = getPendingKey(config);
        const controller = new AbortController();
        if (!config.signal) config.signal = controller.signal;
        if (!state.has(pendingKey)) state.set(pendingKey, controller);
        return state;
    });
/**
 * 删除一对重复请求取消函数的key-函数映射
 * @param config axios请求配置
 * @param maps 映射对象
 */
const removePending = (config: InternalAxiosRequestConfig, maps: Map<string, AbortController>) =>
    produce(maps, (state) => {
        const pendingKey = getPendingKey(config);
        const controller = state.get(pendingKey);
        if (!isNil(controller)) {
            controller.abort();
            state.delete(pendingKey);
        }
        return state;
    });
