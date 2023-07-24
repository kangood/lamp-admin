import { omit } from 'lodash';

import { createFromIconfontCN } from '@ant-design/icons';

import { deepMerge } from '@/utils';

import { config } from '@/config';

import { createStore } from '../store';

import type { IconState } from './types';
import { defaultIconConfig } from './_default.config';

export const IconStore = createStore<IconState>(() => {
    const customConfig = config().icon;
    const options: IconState = deepMerge(
        defaultIconConfig,
        omit(customConfig ?? {}, ['iconfont']) as any,
        'replace',
    );
    if (customConfig?.iconfont_urls) {
        options.iconfont = createFromIconfontCN({
            scriptUrl: customConfig.iconfont_urls,
        });
    }
    return options;
});
