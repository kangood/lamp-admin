import { Locale } from 'antd/es/locale';

export type LocaleState = ReRequired<LocaleConfig>;

export type LocaleConfig = {
    name: string;
    label: string;
};

export type LangItem = LocaleConfig & {
    antdData: Locale;
};
