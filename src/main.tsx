import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';

import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import App from './App';
import './styles/index.css';
import { queryClient } from './http/tanstack/react-query';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </QueryClientProvider>,
);
