import { LayoutState } from './types';

export const DefaultLayoutConfig: Omit<LayoutState, 'mobileSide'> = {
    mode: 'side',
    collapsed: false,
    theme: {
        header: 'light',
        sidebar: 'dark',
        embed: 'light',
    },
    fixed: {
        header: false,
        sidebar: false,
        embed: false,
    },
    styles: {
        sidebarWidth: '12.5rem',
        sidebarCollapseWidth: '4rem',
        headerHeight: '3rem',
        headerLightColor: '#fff',
    },
    menu: {
        data: [],
        opens: [],
        selects: [],
        rootSubKeys: [],
        split: {
            data: [],
            selects: [],
        },
    },
};
