import { Drawer, Layout, theme as AntdTheme } from 'antd';

import { useCallback, useMemo, useState } from 'react';

import { CollapseType } from 'antd/lib/layout/Sider';

import { useUpdateEffect } from 'react-use';

import { useDebounceFn } from 'ahooks';

import { useResponsiveMobileCheck } from '@/utils/hooks';

import { EmbedMenu, SideMenu } from '@/components/layout/components/menu';

import { useLayout, useLayoutAction, useLayoutTheme } from '../../hooks';

import { Logo } from './logo';

export const Sidebar = () => {
    const { Sider } = Layout;
    const isMobile = useResponsiveMobileCheck();
    const { mode, collapsed, styles: layoutStyles, mobileSide, menu } = useLayout();
    const theme = useLayoutTheme();
    const { changeCollapse, changeMobileSide } = useLayoutAction();
    const [collapse, setCollapse] = useState(collapsed);
    useUpdateEffect(() => {
        setCollapse(collapsed);
    }, [collapsed]);
    const { run: onCollapse } = useDebounceFn(
        (_value: boolean, type: CollapseType) => {
            if (!isMobile && type === 'responsive') changeCollapse(true);
        },
        { wait: 100 },
    );
    const closeDrawer = useCallback(() => changeMobileSide(false), []);
    const {
        token: { colorBgContainer },
    } = AntdTheme.useToken();
    const styles = useMemo(
        () => (theme.sidebar !== 'dark' ? { background: colorBgContainer } : {}),
        [theme.sidebar],
    );
    if (!isMobile) {
        if (mode === 'top') return null;
        if (mode === 'embed') {
            return (
                <Sider
                    collapsible
                    collapsed
                    style={styles}
                    collapsedWidth={layoutStyles.sidebarCollapseWidth}
                    trigger={null}
                >
                    <EmbedMenu theme={theme.sidebar} menu={menu} />
                </Sider>
            );
        }
        return (
            <Sider
                collapsible
                style={styles}
                collapsed={collapse}
                width={layoutStyles.sidebarWidth}
                // onBreakpoint={onBreakpoint}
                collapsedWidth={layoutStyles.sidebarCollapseWidth}
                breakpoint="lg"
                onCollapse={onCollapse}
                trigger={null}
            >
                {mode !== 'content' ? <Logo style={{ backgroundColor: '#000' }} /> : null}
                <SideMenu theme={theme.sidebar} menu={menu} />
            </Sider>
        );
    }

    return (
        <Drawer
            placement="left"
            open={mobileSide}
            onClose={closeDrawer}
            width={layoutStyles.sidebarWidth}
            closable={false}
            bodyStyle={{ padding: 0 }}
        >
            <Layout className="tw-h-full">
                <Sider
                    collapsible={false}
                    width="100%"
                    className="tw-h-full"
                    style={styles}
                    trigger={null}
                >
                    <Logo style={{ backgroundColor: '#000' }} />
                    <SideMenu theme={theme.sidebar} menu={menu} />
                </Sider>
            </Layout>
        </Drawer>
    );
};
export const EmbedSidebar = () => {
    const { Sider } = Layout;
    const { styles, menu } = useLayout();
    const theme = useLayoutTheme();
    return (
        <Sider
            collapsible
            theme={theme.embed}
            // collapsed={collapsed}
            collapsedWidth={styles.sidebarCollapseWidth}
            trigger={null}
        >
            <SideMenu theme={theme.embed} menu={menu} />
        </Sider>
    );
};
