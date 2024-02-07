import { IConfig } from '../types';

import { dashboard } from './routes/dashboard';
import { errors } from './routes/errors';
import { home } from './routes/home';

import { addLoading } from './routes/loading';
import { org } from './routes/org';
import { setting } from './routes/setting';

export const config = (): IConfig => ({
    auth: { api: '/user/info' },
    router: {
        basename: import.meta.env.BASE_URL,
        window: undefined,
        // 在这里切换路由。true 使用 hash 路由，false 使用 browser 路由
        hash: true,
        routes: [
            {
                id: 'layout.master',
                menu: false,
                path: '/',
                page: 'layouts/master',
                error: 'errors/404',
                children: addLoading([home, org, dashboard, setting]),
            },
            errors,
        ],
    },
});
