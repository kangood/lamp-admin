/** ******************************  设备相关 ********************************** */

import { useDeepCompareEffect, useMedia, useUpdateEffect } from 'react-use';

import { DependencyList, EffectCallback, useRef, useState } from 'react';

import { config } from '@/config';

import { defaultScreenConfig } from './constants';
import { deepMerge } from './helpers';

export const useResponsive = () => {
    const screenSize = deepMerge(defaultScreenConfig, config().screen ?? {});
    const mobile = useMedia(`(max-width: ${screenSize.sm - 1}px)`, true);
    const tablet = useMedia(`(max-width: ${screenSize.md - 1}px)`, true);
    const notebook = useMedia(`(max-width: ${screenSize.lg - 1}px)`, true);
    const pc = useMedia(`(min-width: ${screenSize.lg}px)`, true);
    const [isMobile, setMobile] = useState(mobile);
    const [isTablet, setTablet] = useState(tablet);
    const [isNotebook, setNotebook] = useState(notebook);
    const [isPC, setPC] = useState(pc);
    useUpdateEffect(() => {
        setMobile(mobile);
        setTablet(tablet);
        setNotebook(notebook);
        setPC(pc);
    }, [mobile, tablet, notebook, pc]);
    return { isMobile, isTablet, isNotebook, isPC };
};
/**
 * 通过响应式检测是否为移动设备屏幕
 */
export const useResponsiveMobileCheck = () => {
    const screenSize = deepMerge(defaultScreenConfig, config().screen ?? {});
    const responsive = useMedia(`(max-width: ${screenSize.sm - 1}px)`, true);
    const [isMobile, setMobile] = useState(responsive);
    useUpdateEffect(() => {
        setMobile(responsive);
    }, [responsive]);
    return isMobile;
};

/**
 * ahooks和react-use的`useUpdateEffect`的深度对比版本
 * @param effect 需要执行的函数
 * @param deps 依赖项
 */
export const useDeepCompareUpdateEffect = (effect: EffectCallback, deps: DependencyList) => {
    const isFirst = useRef(true);

    // eslint-disable-next-line consistent-return
    useDeepCompareEffect(() => {
        if (!isFirst.current) {
            return effect();
        }
        isFirst.current = false;
    }, deps);
};
