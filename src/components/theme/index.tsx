import Icon from '../icon/icon';

import { useTheme, useThemeActions } from './hooks';

/**
 * 主题切换组件
 */
const Theme = () => {
    const { mode } = useTheme();
    const { toggleMode } = useThemeActions();
    return mode === 'dark' ? (
        <Icon name="fy:carbon:moon" className="cursor-pointer" onClick={toggleMode} />
    ) : (
        <Icon name="fy:carbon:sun" className="cursor-pointer" onClick={toggleMode} />
    );
};
export default Theme;
