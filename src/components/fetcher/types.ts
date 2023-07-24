import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BareFetcher, PublicConfiguration } from 'swr/_internal';

/**
 * Fetcher配置
 */
export interface FetcherConfig<D = any, E = any> extends AxiosRequestConfig, FetchOption {
    ddd?: string;
    swr: SwrConfig<D, E>;
}
/**
 * swrjs配置
 */
export interface SwrConfig<D = any, E = any>
    extends Partial<PublicConfiguration<D, E, BareFetcher<AxiosResponse<any, any>>>> {}

/**
 * 自定义选项参数
 */
export interface FetchOption {
    /** 当前账户验证token */
    token?: string | null;
    /** 是否禁止重复请求 */
    cancel_repeat?: boolean;
    /** 自定义axios请求和响应函数 */
    interceptors?: {
        request?: (
            req: AxiosInterceptorManager<AxiosRequestConfig>,
        ) => AxiosInterceptorManager<AxiosRequestConfig>;
        response?: (
            res: AxiosInterceptorManager<AxiosResponse>,
        ) => AxiosInterceptorManager<AxiosResponse>;
    };
}
