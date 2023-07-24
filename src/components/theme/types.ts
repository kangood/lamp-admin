import DarkReader from 'darkreader';

import { ThemeMode } from './constants';

/**
 * 主题配置
 */
export interface ThemeConfig {
    /** 主题模式 */
    mode?: `${ThemeMode}`;
    /** 紧凑模式 */
    compact?: boolean;
    /** DarkRender配置 */
    darken?: DarkReaderConfig;
}

/**
 * 主题组件状态池
 */
export type ThemeState = ReRequired<Omit<ThemeConfig, 'darken'>> & {
    darken: DarkReaderConfig;
};

/**
 * 主题状态更改函数
 */
export interface ThemeAction {
    changeMode: (mode: `${ThemeMode}`) => void;
    toggleMode: () => void;
    changeCompact: (compact: boolean) => void;
    toggleCompact: () => void;
}

/**
 * dark-reader配置类型
 */
export interface DarkReaderConfig {
    theme?: Partial<DarkReader.Theme>;
    fixes?: Partial<DarkReader.DynamicThemeFix>;
}
