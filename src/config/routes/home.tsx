import { redirect } from 'react-router';

import { RouteOption } from '@/components/router/types';

export const home: RouteOption = {
    id: 'home',
    index: true,
    menu: false,
    loader: () => {
        return redirect('/dashboard/monitor');
    },
};
