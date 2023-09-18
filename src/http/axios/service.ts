import axios from 'axios';

import { isNil } from 'lodash';

import { message } from 'antd';

import { FetcherStore } from '@/components/fetcher/store';
import { globalError } from '@/utils/antd-extract';

// 保存环境变量
const isPrd = process.env.NODE_ENV === 'production';

// 区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'http://127.0.0.1:7001' : 'http://127.0.0.1:6001';

// 这里的token必须实时获取，固定常量在这儿是不更新的
// const accessToken = FetcherStore.getState().token;
// const refreshToken = localStorage.getItem('refresh_token');

// 刷新token的API调用
const refreshTokenApi = async () => {
    // 调用API
    const res = await service.get('auth/refresh', {
        params: {
            refreshToken: localStorage.getItem('refresh_token'),
        },
    });
    if (res) {
        // 更新token数据
        FetcherStore.setState((state) => {
            state.token = res.data.accessToken;
        });
        localStorage.setItem('refresh_token', res.data.refreshToken);
    }
    return res;
};
// 设置axios的额外配置
export const service = axios.create({
    baseURL: `${basicUrl}/api`,
});
// 拦截请求处理
service.interceptors.request.use(async (params) => {
    // 添加token
    if (FetcherStore.getState().token && typeof window !== 'undefined') {
        params.headers.set('Authorization', `Bearer ${FetcherStore.getState().token}`);
    }
    return params;
});
// 拦截响应处理
service.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        // if (import.meta.env.DEV) console.log('respError', error);
        if (!isNil(error.response))
            switch (error.response.status) {
                case 401: {
                    // 如果响应401就把原本的FetcherStore数据设置为空，好让页面跳至登录页
                    FetcherStore.setState((state) => {
                        state.token = null;
                    });
                    // 响应401且不是刷新token的请求时，去主动调用刷新token请求
                    if (!error.response.config.url.includes('auth/refresh')) {
                        const res = await refreshTokenApi();
                        if (res.status === 200) {
                            return axios(error.response.config);
                        }
                        message.error('登录过期，请重新登录');
                        return Promise.reject(res.data);
                    }
                    break;
                }
                default:
                    globalError(error);
                    break;
            }
        return Promise.reject(error);
    },
);
