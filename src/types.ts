import { AuthConfig } from './components/auth/type';
import { FetcherConfig } from './components/fetcher/types';
import { LocaleConfig } from './components/i18n/types';
import { IconConfig } from './components/icon/types';
import { LayoutConfig } from './components/layout/types';
import { RouterConfig } from './components/router/types';
import { ThemeConfig } from './components/theme/types';
import { ScreenSizeType } from './utils/constants';

export interface IConfig {
    locale?: LocaleConfig;
    theme?: ThemeConfig;
    icon?: IconConfig;
    router?: RouterConfig;
    layout?: LayoutConfig;
    fetcher?: FetcherConfig;
    screen?: { [key in `${ScreenSizeType}`]: number };
    auth?: AuthConfig;
}
