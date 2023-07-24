import 'dayjs/locale/zh-cn';

import { FC, useEffect, useState } from 'react';

import { MappingAlgorithm, ThemeConfig } from 'antd/es/config-provider/context';

import { ConfigProvider, theme, App as AntdApp } from 'antd';

import { Locale } from 'antd/es/locale';

import { produce } from 'immer';

import { StyleProvider } from '@ant-design/cssinjs';

import Router from './components/router/router';
import { Fetcher } from './components/fetcher/provider';
import { useTheme, useThemeListner } from './components/theme/hooks';
import { getDefaultLang, useLocale } from './components/i18n/hooks';

const App: FC = () => {
    useThemeListner();
    const { mode, compact } = useTheme();
    const langConfig = useLocale();
    const [algorithm, setAlgorithm] = useState<MappingAlgorithm[]>([theme.defaultAlgorithm]);
    const [locale, setLocale] = useState<Locale>(getDefaultLang().antdData);
    const [antdTheme, setAntdTheme] = useState<ThemeConfig>({
        components: {
            Tabs: {
                cardPaddingSM: '0.3rem',
                horizontalItemGutter: 50,
                cardGutter: 10,
                titleFontSizeSM: 12,
                horizontalMargin: '0',
            },
        },
    });

    useEffect(() => {
        if (!compact) {
            setAlgorithm(mode === 'light' ? [theme.defaultAlgorithm] : [theme.darkAlgorithm]);
        } else {
            setAlgorithm(
                mode === 'light'
                    ? [theme.defaultAlgorithm, theme.compactAlgorithm]
                    : [theme.darkAlgorithm, theme.compactAlgorithm],
            );
        }
        if (mode === 'dark') {
            setAntdTheme((state) =>
                produce(state, (draft) => {
                    draft.token = {
                        colorText: 'rgb(175 166 153 / 85%)',
                    };
                    draft.components!.Tabs!.itemSelectedColor = 'rgb(208 208 208 / 88%)';
                }),
            );
        } else {
            setAntdTheme((state) =>
                produce(state, (draft) => {
                    draft.token = {
                        colorText: 'rgb(60 60 60 / 88%)',
                    };
                    draft.components!.Tabs!.itemSelectedColor = 'rgb(80 80 80 / 88%)';
                }),
            );
        }
    }, [mode, compact]);

    useEffect(() => {
        setLocale(langConfig.antdData);
    }, [langConfig]);

    return (
        <ConfigProvider
            locale={locale}
            theme={{
                algorithm,
                ...antdTheme,
            }}
        >
            <StyleProvider hashPriority="high">
                <AntdApp>
                    <Fetcher>
                        <Router />
                    </Fetcher>
                </AntdApp>
            </StyleProvider>
        </ConfigProvider>
    );
};

export default App;
