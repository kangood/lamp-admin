import { CSSProperties, Reducer } from 'react';

import { kebabCase } from 'lodash';

import { produce } from 'immer';

import clsx from 'clsx';

import { Location, matchPath } from 'react-router';

import { deepMerge, isUrl } from '@/utils';

import { RouteOption } from '../router/types';

import {
    LayoutAction,
    LayoutFixed,
    LayoutMenuState,
    LayoutSplitMenuState,
    LayoutState,
    LayoutStylesConfig,
} from './types';
import { LayoutActionType, LayoutMode } from './constants';

/**
 * 布局组件状态操作
 */
export const layoutReducer: Reducer<LayoutState, LayoutAction> = produce((state, action) => {
    switch (action.type) {
        case LayoutActionType.CHANGE_STYLES: {
            state.styles = { ...state.styles, ...action.styles };
            break;
        }
        case LayoutActionType.CHANGE_MODE: {
            state.mode = action.value;
            break;
        }
        case LayoutActionType.CHANGE_FIXED: {
            const newFixed = { [action.key]: action.value };
            state.fixed = getLayoutFixed(state.mode, { ...state.fixed, ...newFixed }, newFixed);
            break;
        }
        case LayoutActionType.CHANGE_COLLAPSE: {
            state.collapsed = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_COLLAPSE: {
            state.collapsed = !state.collapsed;
            break;
        }
        case LayoutActionType.CHANGE_MOBILE_SIDE: {
            state.mobileSide = action.value;
            break;
        }
        case LayoutActionType.TOGGLE_MOBILE_SIDE: {
            state.mobileSide = !state.mobileSide;
            break;
        }
        case LayoutActionType.CHANGE_THEME: {
            state.theme = { ...state.theme, ...action.value };
            break;
        }
        case LayoutActionType.CHANGE_MENU: {
            state.menu = deepMerge(state.menu, action.value, 'replace');
            break;
        }
        default:
            break;
    }
});
/**
 * 获取布局页面顶级CSS类
 * @param fixed 子组件固定状态
 * @param mode 布局模式
 * @param style css module类
 * @param isMobile 是否处于移动屏幕
 */
export const getLayoutClasses = (
    fixed: LayoutFixed,
    mode: `${LayoutMode}`,
    style: CSSModuleClasses,
    isMobile: boolean,
) => {
    const items = ['!min-h-screen'];
    if (fixed.header || fixed.sidebar || fixed.embed) {
        items.push(style.layoutFixed);
    }
    switch (mode) {
        case 'side':
            if (fixed.header) items.push(style.layoutSideHeaderFixed);
            else if (fixed.sidebar) items.push(style.layoutSideSidebarFixed);
            break;
        case 'content':
            if (fixed.sidebar) items.push(style.layoutContentSidebarFixed);
            else if (fixed.header) items.push(style.layoutContentHeaderFixed);
            break;
        case 'top':
            if (fixed.header) items.push(style.layoutTopHeaderFixed);
            break;
        case 'embed':
            items.push(style.layoutEmbed);
            if (fixed.header) items.push(style.layoutEmbedHeaderFixed);
            else if (fixed.embed) items.push(style.layoutEmbedEmbedFixed);
            else if (fixed.sidebar) items.push(style.layoutEmbedSidebarFixed);
            break;
        default:
            break;
    }
    if (isMobile) items.push(style.mobileLayout);
    return clsx(items);
};
/**
 * 根据css变量状态生成真实css变量
 * @param style css变量状态
 */
export const getLayoutCssStyle = (style: Required<LayoutStylesConfig>): CSSProperties =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [
            `--${kebabCase(key)}`,
            typeof value === 'number' ? `${value}px` : value,
        ]),
    );
/**
 * 更改子组件固定模式后生成的最终固定状态
 * @param mode 布局模式
 * @param fixed 旧状态
 * @param newFixed 新状态
 */
export const getLayoutFixed = (
    mode: `${LayoutMode}`,
    fixed: LayoutFixed,
    newFixed: Partial<LayoutFixed>,
) => {
    const current = { ...fixed, ...newFixed };
    if (mode === 'side') {
        if (newFixed.header) current.sidebar = true;
        if (newFixed.sidebar !== undefined && !newFixed.sidebar) current.header = false;
    } else if (mode === 'content') {
        if (newFixed.sidebar) current.header = true;
        if (newFixed.header !== undefined && !newFixed.header) current.sidebar = false;
    } else if (mode === 'embed') {
        if (newFixed.header) {
            current.sidebar = true;
            current.embed = true;
        }
        if (newFixed.sidebar !== undefined && !newFixed.sidebar) {
            current.embed = false;
            current.header = false;
        }
        if (newFixed.embed) current.sidebar = true;
        if (newFixed.embed !== undefined && !newFixed.embed) current.header = false;
    }
    return current;
};

/**
 * 生成菜单状态
 * @param menus 菜单数据(来自菜单组件)
 * @param location 当前location对象
 * @param layoutMode 布局模式
 * @param isMobile 是否为移动设备下
 */
export const getMenuData = (
    menus: RouteOption[],
    location: Location,
    layoutMode: `${LayoutMode}`,
    isMobile: boolean,
): LayoutMenuState => {
    const split: LayoutSplitMenuState = {
        data: [],
        selects: [],
    };
    let data = menus;
    // 获取选中的菜单ID
    let selects = diffKeys(getSelectMenus(data, location));
    // 获取打开的菜单ID
    let opens = diffKeys(getOpenMenus(data, selects, []));
    // 获取顶级菜单中拥有子菜单的菜单ID
    let rootSubKeys = diffKeys(data.filter((menu) => menu.children));
    if (layoutMode === 'embed' && !isMobile) {
        split.data = menus.map((item) => {
            const { children, ...meta } = item;
            return meta;
        });
        const select = data.find((item) => selects.includes(item.id) || opens.includes(item.id));
        if (!select || !select.children) {
            opens = [];
            rootSubKeys = [];
            data = [];
        }
        if (select) {
            split.selects = [select.id];
            if (select.children) {
                data = select.children;
                selects = diffKeys(getSelectMenus(data, location));
                opens = diffKeys(getOpenMenus(data, selects, []));
                rootSubKeys = diffKeys(data.filter((menu) => menu.children));
            }
        }
    }
    return {
        data,
        opens,
        selects,
        rootSubKeys,
        split,
    };
};
const diffKeys = (menus: RouteOption[]) => menus.map((menu) => menu.id);
const getSelectMenus = (menus: RouteOption[], location: Location): RouteOption[] =>
    menus
        .map((menu) => {
            if (menu.children) return getSelectMenus(menu.children, location);
            if (menu.path && !isUrl(menu.path) && matchPath(menu.path, location.pathname)) {
                return [menu];
            }
            return [];
        })
        .reduce((o, n) => [...o, ...n], []);
const getOpenMenus = (
    menus: RouteOption[],
    selects: string[],
    parents: RouteOption[],
): RouteOption[] => {
    return menus
        .map((menu) => {
            if (!menu.children) return selects.includes(menu.id) ? [...parents] : [];
            return getOpenMenus(menu.children, selects, [...parents, menu]);
        })
        .reduce((o, n) => [...o, ...n], []);
};
