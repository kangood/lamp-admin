import axios from 'axios';

// 保存环境变量
const isPrd = process.env.NODE_ENV === 'production';

// 区分开发环境还是生产环境基础URL
export const basicUrl = isPrd ? 'http://127.0.0.1:7001' : 'http://127.0.0.1:6001';

// 设置axios基础路径
export const service = axios.create({
    baseURL: `${basicUrl}/api`,
});
