import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';

import { LangItem } from './types';

export const langs: LangItem[] = [
    {
        name: 'en_US',
        label: '🇺🇸 english(US)',
        antdData: enUS,
    },
    {
        name: 'zh_CN',
        label: '🇨🇳 简体中文',
        antdData: zhCN,
    },
];
