import axios from 'axios';

import { isNil } from 'lodash';

import { AUTH_TOKEN } from '@/components/auth/constants';
import { FetcherStore } from '@/components/fetcher/store';

// 保存环境变量
const isPrd = process.env.NODE_ENV === 'production';

// 区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'http://127.0.0.1:7001' : 'http://127.0.0.1:6001';

const token = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);

// 设置axios的额外配置
export const service = axios.create({
    baseURL: `${basicUrl}/api`,
    headers: {
        Authorization: token ? `Bearer ${token}` : '',
    },
});
service.interceptors.response.use(
    async (response) => {
        // const resToken = response.headers.authorization;
        // // 如果返回头中带有token并且和当前token不同则储存新的token
        // if (resToken && sessionStorage.getItem(AUTH_TOKEN) !== resToken) {
        //     sessionStorage.setItem(AUTH_TOKEN, resToken);
        // }
        return response;
    },
    async (error) => {
        if (import.meta.env.DEV) console.log(error);
        if (!isNil(error.response))
            switch (error.response.status) {
                // 如果响应401就把原本的FetcherStore数据设置为空，好让页面跳至登录页
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
