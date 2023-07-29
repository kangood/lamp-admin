import { redirect } from 'react-router';

import { RouteOption } from '@/components/router/types';

import SettingIcon from '~icons/clarity/settings-outline-alerted';

export const setting: RouteOption = {
    path: 'setting',
    id: 'setting',
    meta: { name: '系统设置', icon: SettingIcon },
    children: [
        {
            id: 'parameter.index',
            index: true,
            menu: false,
            loader: () => redirect('/setting/parameters/list'),
        },
        {
            id: 'parameter.list',
            path: 'parameters/list',
            page: 'setting/parameters/list',
            meta: { name: '参数管理' },
        },
        {
            id: 'parameters.edit',
            menu: false,
            path: 'parameters/edit',
            page: 'setting/parameters/edit',
        },
    ],
};
