import { RouteOption } from '@/components/router/types';

export const account: RouteOption = {
    id: 'account',
    menu: false,
    path: 'account',
    meta: { name: '账号设置' },
    children: [
        {
            id: 'account.index',
            menu: false,
            index: true,
            page: 'account/center/index',
        },
        {
            id: 'account.setting',
            menu: false,
            path: 'setting',
            page: 'account/setting/index',
        },
    ],
};
