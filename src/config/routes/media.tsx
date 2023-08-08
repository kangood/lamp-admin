import { RouteOption } from '@/components/router/types';

import MediaIcon from '~icons/icon-park-outline/solid-state-disk';

export const media: RouteOption = {
    path: 'media',
    id: 'media',
    page: 'media/index',
    meta: { name: '文件管理', icon: MediaIcon },
};
