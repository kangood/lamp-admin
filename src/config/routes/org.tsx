import { redirect } from 'react-router';

import { RouteOption } from '@/components/router/types';

import OrganisationIcon from '~icons/gg/organisation';

export const org: RouteOption = {
    id: 'org',
    path: 'org',
    meta: {
        name: '组织机构',
        icon: OrganisationIcon,
    },
    children: [
        {
            id: 'org.index',
            index: true,
            menu: false,
            loader: () => redirect('/org/orgs/list'),
        },
        {
            id: 'org.list',
            path: 'orgs/list',
            page: 'org/orgs/list',
            meta: { name: '机构管理' },
        },
        {
            id: 'station.list',
            path: 'stations/list',
            page: 'org/stations/list',
            meta: { name: '岗位管理' },
        },
    ],
};
