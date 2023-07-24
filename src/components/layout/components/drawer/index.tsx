import { Divider, Drawer, Switch, Tooltip } from 'antd';
import { FC, ReactNode, useCallback, useState } from 'react';

import clsx from 'clsx';

import { useLayout, useLayoutAction } from '../../hooks';

import { ChangeDrawerContext, DrawerContext, useDrawer, useDrawerChange } from './hooks';

import $styles from './style.module.css';

import { LayoutModeList, LayoutTheme, LayoutThemeList } from './constants';

const LayoutSetting = () => {
    const { changeMode } = useLayoutAction();
    return (
        <div className={$styles.layoutMode}>
            {LayoutModeList.map((item, index) => (
                <Tooltip title={item.title} placement="bottom" key={index.toFixed()}>
                    <div
                        className={clsx(['item', item.type])}
                        onClick={() => changeMode(item.type)}
                    >
                        {item.type === 'embed' ? <div className="content-sidebar" /> : null}
                    </div>
                </Tooltip>
            ))}
        </div>
    );
};

const ThemeSetting = () => {
    const { changeTheme: changeLayoutTheme } = useLayoutAction();
    const changeTheme = useCallback((type: `${LayoutTheme}`) => {
        const theme = type.split('-') as Array<'light' | 'dark'>;
        if (theme.length === 2) {
            changeLayoutTheme({
                header: theme[1],
                sidebar: theme[0],
            });
        }
    }, []);
    return (
        <div className={$styles.layoutTheme}>
            {LayoutThemeList.map((item, index) => (
                <Tooltip title={item.title} placement="bottom" key={index.toFixed()}>
                    <div
                        className={clsx(['item', item.type])}
                        onClick={() => changeTheme(item.type)}
                    />
                </Tooltip>
            ))}
        </div>
    );
};

// const ColorSetting = () => {
//     const colors = useColors();
//     const { changeColor } = useColorDispatch();
//     const [display, setDisplay] = useState<{ [key in NonNullable<keyof ColorConfig>]: boolean }>({
//         primary: false,
//         info: false,
//         success: false,
//         warning: false,
//         error: false,
//     });
//     const closePickers = useCallback(() => {
//         setDisplay(
//             produce((state) => {
//                 Object.keys(state).forEach((key) => {
//                     state[key] = false;
//                 });
//             }),
//         );
//     }, []);
//     const togglePicker = useCallback((picker: keyof ColorConfig) => {
//         closePickers();
//         setDisplay(
//             produce((state) => {
//                 state[picker] = !state[picker];
//             }),
//         );
//     }, []);
//     const changeAppColor = useCallback((color: ColorResult['rgb'], type: keyof ColorConfig) => {
//         const rgba = `rgba(${color.r},${color.g},${color.b},${color.a ?? 1})`;
//         changeColor(type, rgba);
//     }, []);
//     return (
//         <div className={$styles.colorSetting}>
//             {ColorList.map((item, index) => (
//                 <Tooltip title={item.title} placement="bottom" key={index.toFixed()}>
//                     <div className="item">
//                         <div className="swatch" onClick={() => togglePicker(item.type)}>
//                             <div
//                                 className="swatch-color"
//                                 style={{ backgroundColor: colors[item.type] }}
//                             />
//                         </div>
//                         {display[item.type] ? (
//                             <div className="picker-popover">
//                                 <div className="picker-cover" onClick={closePickers} />
//                                 <SketchPicker
//                                     color={colors[item.type]}
//                                     onChangeComplete={(color) =>
//                                         changeAppColor(color.rgb, item.type)
//                                     }
//                                 />
//                             </div>
//                         ) : null}
//                     </div>
//                 </Tooltip>
//             ))}
//         </div>
//     );
// };

const Feature: FC = () => {
    const { mode, fixed, collapsed } = useLayout();
    const { changeFixed, changeCollapse } = useLayoutAction();
    return (
        <>
            <div className="tw-flex tw-justify-between tw-mb-2">
                <span>固定顶栏</span>
                <Switch
                    checked={fixed.header}
                    onChange={(checked) => changeFixed('header', checked)}
                />
            </div>
            <div className="tw-flex tw-justify-between tw-my-2">
                <span>固定侧边栏</span>
                <Switch
                    checked={fixed.sidebar}
                    onChange={(checked) => changeFixed('sidebar', checked)}
                />
            </div>

            {mode === 'embed' ? (
                <div className="tw-flex tw-justify-between tw-my-2">
                    <span>固定子侧边栏</span>
                    <Switch
                        checked={fixed.embed}
                        onChange={(checked) => changeFixed('embed', checked)}
                    />
                </div>
            ) : null}

            <div className="tw-flex tw-justify-between tw-mb-2">
                <span>折叠边栏</span>
                <Switch checked={collapsed} onChange={(checked) => changeCollapse(checked)} />
            </div>
        </>
    );
};

const DrawerProvider: FC<{ children?: ReactNode }> = ({ children }) => {
    const [show, changeShow] = useState(false);
    const changeStatus = useCallback(changeShow, []);
    return (
        <DrawerContext.Provider value={show}>
            <ChangeDrawerContext.Provider value={changeStatus}>
                {children}
            </ChangeDrawerContext.Provider>
        </DrawerContext.Provider>
    );
};

const DrawerView: FC = () => {
    const open = useDrawer();
    const changeVisible = useDrawerChange();
    return (
        <Drawer
            title="界面设置"
            placement="right"
            size="default"
            onClose={() => changeVisible(false)}
            open={open}
        >
            <Divider>布局</Divider>
            <LayoutSetting />
            <Divider>风格</Divider>
            <ThemeSetting />
            {/* <Divider>颜色</Divider> */}
            {/* <ColorSetting /> */}
            <Divider>功能</Divider>
            <Feature />
        </Drawer>
    );
};
export const ConfigDrawer: FC<{ children?: ReactNode }> = ({ children }) => (
    <DrawerProvider>
        {children}
        <DrawerView />
    </DrawerProvider>
);
