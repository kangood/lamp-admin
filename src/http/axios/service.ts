import axios from 'axios';

import { AUTH_TOKEN } from '@/components/auth/constants';

// 保存环境变量
const isPrd = process.env.NODE_ENV === 'production';

// 区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'http://127.0.0.1:7001' : 'http://127.0.0.1:6001';

const token = sessionStorage.getItem(AUTH_TOKEN) || localStorage.getItem(AUTH_TOKEN);
// 设置axios基础路径
export const service = axios.create({
    baseURL: `${basicUrl}/api`,
    headers: {
        Authorization: token ? `Bearer ${token}` : '',
    },
});
