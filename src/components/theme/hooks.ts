import { useCallback, useEffect, useRef } from 'react';

import { useUnmount } from 'react-use';

import { shallow } from 'zustand/shallow';

import { useStore } from 'zustand';

import { isNil } from 'lodash';
// import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader';

import { debounceRun } from '@/utils/helpers';

import { ThemeMode } from './constants';
import { ThemeStore } from './store';
/**
 * 获取主题状态
 */
export const useTheme = () =>
    useStore(ThemeStore, (state) => ({ mode: state.mode, compact: state.compact }), shallow);

/**
 * 获取darken-reader配置
 */
export const useDarken = () => useStore(ThemeStore, (state) => state.darken);

/**
 * 主题操作函数
 */
export const useThemeActions = () => ({
    changeMode: useCallback(
        useStore(ThemeStore, (state) => state.changeMode),
        [],
    ),
    toggleMode: useCallback(
        useStore(ThemeStore, (state) => state.toggleMode),
        [],
    ),
    changeCompact: useCallback(
        useStore(ThemeStore, (state) => state.changeCompact),
        [],
    ),
    toggleCompact: useCallback(
        useStore(ThemeStore, (state) => state.toggleCompact),
        [],
    ),
});

/**
 * 暗黑和明亮模式的切换监听器
 * @param mode
 */
const ThemeModeListener = async (mode: `${ThemeMode}`) => {
    // 为tailwind添加暗黑主题类
    // const { mode: theme, darken } = ThemeStore.getState();
    const reverse = mode === 'dark' ? 'light' : 'dark';
    const html = document.documentElement;
    html.classList.remove(reverse);
    html.classList.remove(mode);
    html.classList.add(mode);
    // if (typeof window !== 'undefined') {
    //     const { enable: enableDarkMode, disable: disableDarkMode } = await import('darkreader');
    //     if (theme === 'dark') {
    //         enableDarkMode(darken.theme ?? {}, darken.fixes as any);
    //     } else {
    //         disableDarkMode();
    //     }
    // }
};

/**
 * 主题组件初始化钩子
 */
export const useThemeListner = () => {
    const debounceRef = useRef();
    let unSub: () => void;
    useEffect(() => {
        ThemeStore.subscribe(
            (state) => state.mode,
            (m) => debounceRun(debounceRef, async () => ThemeModeListener(m)),
            {
                fireImmediately: true,
            },
        );
    }, []);
    useUnmount(() => {
        if (!isNil(unSub)) unSub();
    });
};
