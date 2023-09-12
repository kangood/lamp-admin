import { QueryClient } from '@tanstack/react-query';

// 创建一个 client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 全局禁用窗口切换带来的自动刷新
            refetchOnWindowFocus: false,
            // 设置HTTP状态码为403的时候不重试，其他情况取默认值
            retry: (_failureCount, error: any) => error.response?.status !== 403,
        },
    },
});
