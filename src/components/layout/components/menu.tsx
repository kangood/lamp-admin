import { isNil, isString } from 'lodash';

import { Menu, MenuProps } from 'antd';

import { Link } from 'react-router-dom';

import { useCallback, useRef, useState } from 'react';

import { useDebounceFn } from 'ahooks';

import { useUpdateEffect } from 'react-use';

import {
    ItemType,
    MenuDividerType,
    MenuItemGroupType,
    SubMenuType,
} from 'antd/es/menu/hooks/useItems';

import { isUrl } from '@/utils';

import { useResponsive } from '@/utils/hooks';

import Icon from '../../icon/icon';

import { ThemeMode } from '../../theme/constants';

import { useLayout } from '../hooks';

import { RouteOption } from '../../router/types';
import { LayoutMenuState } from '../types';

const getMenuItem = (menu: RouteOption): ItemType => {
    const meta = menu.meta ?? {};
    const text = meta.name ?? menu.id ?? '';
    const item: ItemType = {
        key: menu.id,
    };
    if (menu.devide) {
        return {
            ...item,
            type: 'divider',
        } as MenuDividerType;
    }
    if (menu.onlyGroup) {
        (item as MenuItemGroupType).type = 'group';
        (item as MenuItemGroupType).label = text;
    } else {
        if (!isNil(meta.icon)) {
            (item as any).icon = isString(meta.icon) ? (
                <Icon name={meta.icon as any} />
            ) : (
                <Icon component={meta.icon} style={{ fontSize: '0.875rem' }} />
            );
        }
        if (!isNil(menu.path)) {
            if (!menu.children?.length) {
                item.label = isUrl(menu.path) ? (
                    <a href={menu.path} target={meta.target ?? '_blank'}>
                        {text}
                    </a>
                ) : (
                    <Link to={menu.path}>{text}</Link>
                );
            } else {
                item.label = text;
            }
        }
    }
    if (menu.children?.length) {
        (item as SubMenuType | MenuItemGroupType).children = menu.children.map((child) =>
            getMenuItem(child),
        );
    }
    return item;
};

export const SideMenu: FC<{
    mode?: MenuProps['mode'];
    theme: `${ThemeMode}`;
    menu: LayoutMenuState;
}> = ({ mode = 'inline', theme, menu }) => {
    const { collapsed } = useLayout();
    const { isMobile } = useResponsive();
    const ref = useRef<string[]>(mode !== 'horizontal' ? menu.opens : []);
    const [opens, setOpens] = useState<string[] | undefined>(collapsed ? undefined : ref.current);
    const { run: changeOpens } = useDebounceFn((data: string[]) => setOpens(data), {
        wait: 50,
    });
    useUpdateEffect(() => {
        setOpens(menu.opens);
    }, [menu.opens]);
    useUpdateEffect(() => {
        if (mode !== 'horizontal') {
            collapsed ? setOpens(undefined) : changeOpens(ref.current);
        }
    }, [collapsed]);
    useUpdateEffect(() => {
        if (!collapsed && !isNil(opens) && mode !== 'horizontal') ref.current = opens;
    }, [opens]);
    const onOpenChange = useCallback(
        (keys: string[]) => {
            if (mode === 'horizontal' || collapsed || !opens) return;
            const latest = keys.find((key) => opens.indexOf(key) === -1);
            if (latest && menu.rootSubKeys.indexOf(latest) === -1) {
                setOpens(keys);
            } else {
                setOpens(latest ? [latest] : []);
            }
        },
        [opens, mode, collapsed],
    );
    useUpdateEffect(() => {
        setOpens(menu.opens);
    }, [isMobile]);
    return (
        <div className="fixed-sidebar-content">
            <Menu
                inlineIndent={16}
                theme={theme}
                mode={mode}
                // defaultOpenKeys={menu.opens}
                items={menu.data.map((item) => getMenuItem(item))}
                openKeys={mode !== 'horizontal' ? opens : undefined}
                selectedKeys={menu.selects}
                onOpenChange={onOpenChange}
            />
        </div>
    );
};
export const EmbedMenu: FC<{ theme: `${ThemeMode}`; menu: LayoutMenuState }> = ({
    theme,
    menu,
}) => {
    return (
        <Menu
            theme={theme}
            mode="inline"
            selectedKeys={menu.split.selects}
            items={menu.split.data.map((item) => getMenuItem(item))}
        />
    );
};
