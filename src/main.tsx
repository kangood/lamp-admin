import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import App from './App';
import './styles/index.css';

// 创建一个 client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 全局禁用窗口切换带来的自动刷新
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </QueryClientProvider>,
);
