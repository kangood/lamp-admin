import { RouteOption } from '@/components/router/types';
import SettingIcon from '~icons/clarity/settings-outline-alerted';
export const setting: RouteOption = {
    path: 'setting',
    id: 'setting',
    page: 'setting/index',
    meta: { name: '系统设置', icon: SettingIcon },
};
