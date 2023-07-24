import { omit } from 'lodash';
import { CSSProperties, useCallback, useState } from 'react';

import { useUpdateEffect } from 'react-use';

import { useTheme } from '../theme/hooks';

import { ThemeMode } from '../theme/constants';

import { defaultStyle } from './constants';
import { SpinnerOption } from './types';

export const useSpinnerStyle = <T extends RecordAnyOrNever>(props: SpinnerOption<T>) => {
    const { center, style, size, darkColor, speed } = props;
    const configColor = '#3c3c98';
    const { mode: themeMode } = useTheme();
    const [color, setColor] = useState(props.color ?? configColor);
    const getStyle = useCallback(
        (t: `${ThemeMode}`) => ({
            ...(center ? defaultStyle : {}),
            ...omit(style ?? {}, ['className']),
            '--size': size,
            '--color': t === 'dark' ? darkColor ?? color : color,
            '--speed': speed ? `${speed}s` : undefined,
            '--darkreader-bg--color': darkColor ?? color,
            '--darkreader-border--color': darkColor ?? color,
        }),
        [color],
    );
    const [styles, setStyles] = useState(getStyle(themeMode));
    useUpdateEffect(() => {
        setColor(props.color ?? configColor);
    }, [configColor, props.color]);
    useUpdateEffect(() => {
        setStyles(getStyle(themeMode));
    }, [themeMode]);
    return styles as CSSProperties;
};
