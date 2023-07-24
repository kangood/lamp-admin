import { useCallback, useContext } from 'react';

import { shallow } from 'zustand/shallow';

import { omit } from 'lodash';

import { LayoutFixed, LayoutTheme, LayoutStylesConfig } from './types';
import { LayoutStore } from './store';
import { LayoutActionType, LayoutMode, LayoutThemeContext } from './constants';

export const useLayout = () => LayoutStore((state) => ({ ...omit(state, ['dispatch']) }), shallow);

export const useLayoutTheme = () => useContext(LayoutThemeContext);

export const useLayoutAction = () => {
    const dispatch = LayoutStore((state) => state.dispatch);

    if (!dispatch) throw new Error("please wrapper the layout width 'LayoutProvider'!");
    const changeStyles = useCallback(
        (styles: LayoutStylesConfig) => dispatch({ type: LayoutActionType.CHANGE_STYLES, styles }),
        [],
    );
    const changeMode = useCallback(
        (mode: `${LayoutMode}`) => dispatch({ type: LayoutActionType.CHANGE_MODE, value: mode }),
        [],
    );
    const changeFixed = useCallback(
        (key: keyof LayoutFixed, value: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_FIXED, key, value }),
        [],
    );
    const changeTheme = useCallback((theme: Partial<LayoutTheme>) => {
        // if (systemMode !== 'dark') {
        dispatch({ type: LayoutActionType.CHANGE_THEME, value: theme });
        // }
    }, []);
    const changeCollapse = useCallback(
        (collapsed: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_COLLAPSE, value: collapsed }),
        [],
    );
    const toggleCollapse = useCallback(
        () => dispatch({ type: LayoutActionType.TOGGLE_COLLAPSE }),
        [],
    );
    const changeMobileSide = useCallback(
        (visible: boolean) =>
            dispatch({ type: LayoutActionType.CHANGE_MOBILE_SIDE, value: visible }),
        [],
    );
    const toggleMobileSide = useCallback(
        () => dispatch({ type: LayoutActionType.TOGGLE_MOBILE_SIDE }),
        [],
    );
    return {
        changeStyles,
        changeMode,
        changeFixed,
        changeTheme,
        changeCollapse,
        toggleCollapse,
        changeMobileSide,
        toggleMobileSide,
    };
};
