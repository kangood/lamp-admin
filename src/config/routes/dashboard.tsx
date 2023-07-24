import { redirect } from 'react-router';

import { RouteOption } from '@/components/router/types';

import MonitorIcon from '~icons/carbon/airplay-filled';

export const dashboard: RouteOption = {
    id: 'dashboard',
    path: 'dashboard',
    meta: {
        name: '仪表盘',
        icon: MonitorIcon,
    },
    children: [
        {
            id: 'dashboard.index',
            index: true,
            menu: false,
            loader: () => redirect('/dashboard/monitor'),
        },
        {
            id: 'dashboard.monitor',
            path: 'monitor',
            page: 'dashboard/monitor/index',
            meta: { name: '监控页' },
        },
        {
            id: 'dashboard.anlysis',
            path: 'anlysis',
            page: 'dashboard/anlysis/index',
            meta: { name: '分析页' },
        },
        {
            id: 'dashboard.workspace',
            path: 'workspace',
            page: 'dashboard/workspace/index',
            meta: { name: '工作台' },
        },
    ],
};
