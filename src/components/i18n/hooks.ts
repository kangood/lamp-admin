import { isNil } from 'lodash';

import { useCallback, useMemo } from 'react';

import { useStore } from 'zustand';

import { deepMerge } from '@/utils';

import { config } from '@/config';

import { LocaleStore } from './store';
import { langs } from './langs';
import { defaultLang } from './_default.config';

export const getDefaultLang = () => {
    const fallback = deepMerge(defaultLang, config().locale ?? {});
    const lang = langs.find(({ name }) => fallback.name === name);
    return !isNil(lang) ? lang : langs[0];
};

export const useLocale = () => {
    const current = useStore(LocaleStore, (state) => state.name);
    const lang = langs.find(({ name }) => current === name);
    return useMemo(() => (!isNil(lang) ? lang : getDefaultLang()), [current]);
};
export const useLocalChange = () =>
    useCallback(
        useStore(LocaleStore, (state) => state.changeLang),
        [],
    );
