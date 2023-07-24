import { isNil, omit } from 'lodash';

import { config } from '@/config';

import { createPersistStore } from '../store';

import { deepMerge } from '../../utils/helpers';

import { LocaleState } from './types';
import { defaultLang } from './_default.config';
import { langs } from './langs';

export const LocaleStore = createPersistStore<LocaleState & { changeLang: (name: string) => void }>(
    (set) => ({
        ...deepMerge(defaultLang, config().locale ?? {}),
        changeLang: (name: string) =>
            set((state) => {
                const item = langs.find(({ name: n }) => n === name);
                if (!isNil(item)) return omit(item, ['antdData']);
                return state;
            }),
    }),
    {
        name: 'admin-local',
    },
);
