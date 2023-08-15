import { QueryClient } from '@tanstack/react-query';

// 创建一个 client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 全局禁用窗口切换带来的自动刷新
            refetchOnWindowFocus: false,
        },
    },
});
