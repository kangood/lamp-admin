import { IConfig } from '../types';

import { account } from './routes/account';
import { content } from './routes/content';
import { dashboard } from './routes/dashboard';
import { errors } from './routes/errors';
import { home } from './routes/home';

import { addLoading } from './routes/loading';
import { media } from './routes/media';
import { org } from './routes/org';
import { setting } from './routes/setting';

export const config = (): IConfig => ({
    auth: { api: '/user/info' },
    router: {
        basename: import.meta.env.BASE_URL,
        window: undefined,
        hash: true,
        routes: [
            {
                id: 'layout.master',
                menu: false,
                path: '/',
                page: 'layouts/master',
                error: 'errors/404',
                children: addLoading([home, org, dashboard, account, content, media, setting]),
            },
            errors,
        ],
    },
});
