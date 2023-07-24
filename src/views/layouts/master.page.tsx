import { Outlet } from 'react-router';

import MasterLayout from '@/components/layout';

export default () => {
    return (
        <MasterLayout>
            <Outlet />
        </MasterLayout>
    );
};
