import { Dropdown, MenuProps, Tabs, TabsProps, theme as AntdTheme } from 'antd';

import { memo, useCallback, useMemo, useState } from 'react';

import { filter, findIndex } from 'lodash';

import { useDeepCompareEffect } from 'react-use';

import { useActivedAlive, useKeepAliveDispath, useKeepAlives } from '@/components/KeepAlive';

import { useRouterStore } from '@/components/router/hooks';

import { useDeepCompareUpdateEffect } from '@/utils/hooks';

import { RouteOption } from '@/components/router/types';

import Icon from '@/components/icon/icon';

import $styles from './style.module.css';

import IconRefresh from '~icons/ion/md-refresh';
import IconArrowDown from '~icons/ion/chevron-down-sharp';
import IconClose from '~icons/ion/close-outline';
import IconLeft from '~icons/mdi/arrow-collapse-left';
import IconRight from '~icons/mdi/arrow-collapse-right';
import IconExpend from '~icons/mdi/arrow-expand-horizontal';
import IconClear from '~icons/ant-design/minus-outlined';

const getNames = (routes: RouteOption[]) =>
    Object.fromEntries(routes.map((route) => [route.id, route.meta?.name ?? route.id]));
const ExtraButtons: FC<{ actived: string }> = memo(({ actived }) => {
    const data = useKeepAlives();
    const { removeAlive, removeAlives, clearAlives, refreshAlive } = useKeepAliveDispath();
    const activedIndex = useMemo(
        () => findIndex(data, (item) => item === actived),
        [data, actived],
    );
    const disabledRemoveOthers = useMemo(
        () => filter(data, (item) => item !== actived).length <= 0,
        [activedIndex, data],
    );
    const disabledLeftRemove = useMemo(() => activedIndex < 1, [activedIndex]);
    const disabledRightRemove = useMemo(
        () => activedIndex >= data.length - 1,
        [activedIndex, data],
    );
    const refreshActived = useCallback(() => refreshAlive(actived), [actived]);
    const removeActived = useCallback(() => removeAlive(actived), [actived]);
    const removeOthers = useCallback(
        () => removeAlives(filter(data, (item) => item !== actived)),
        [data, actived],
    );
    const removeLeft = useCallback(
        () => removeAlives(filter(data, (_, index) => index < activedIndex)),
        [data, disabledLeftRemove, activedIndex],
    );
    const removeRight = useCallback(
        () => removeAlives(filter(data, (_, index) => index > activedIndex)),
        [data, disabledRightRemove, activedIndex],
    );
    const menus = useMemo<MenuProps['items']>(
        () => [
            {
                key: 'refresh',
                label: '刷新',
                icon: <Icon component={IconRefresh} />,
                onClick: refreshActived,
            },
            {
                key: 'remove-actived',
                label: '关闭当前',
                icon: <Icon component={IconClose} />,
                onClick: removeActived,
            },
            {
                key: 'remove-others',
                label: '关闭其它',
                icon: <Icon component={IconExpend} />,
                disabled: disabledRemoveOthers,
                onClick: removeOthers,
            },
            {
                key: 'remove-left',
                label: '关闭左侧',
                icon: <Icon component={IconLeft} />,
                disabled: disabledLeftRemove,
                onClick: removeLeft,
            },
            {
                key: 'remove-right',
                label: '关闭右侧',
                icon: <Icon component={IconRight} />,
                disabled: disabledRightRemove,
                onClick: removeRight,
            },
            {
                key: 'remove-all',
                label: '清空标签',
                icon: <Icon component={IconClear} />,
                onClick: clearAlives,
            },
        ],
        [],
    );
    return (
        <Dropdown menu={{ items: menus }} placement="bottomRight" trigger={['click']}>
            <span className="tw-bg-white dark:tw-bg-slate-900 tw-flex tw-py-1 tw-px-1 tw-cursor-pointer">
                <Icon component={IconArrowDown} />
            </span>
        </Dropdown>
    );
});
const KeepLiveTabs = () => {
    const routes = useRouterStore((state) => state.flat);
    const actived = useActivedAlive();
    const data = useKeepAlives();
    const { changeAlive, removeAlive } = useKeepAliveDispath();
    const {
        token: { colorBgContainer, colorBorderSecondary, controlItemBgActive },
    } = AntdTheme.useToken();

    const [tabs, setTabs] = useState<TabsProps['items']>([]);

    const remove: NonNullable<TabsProps['onEdit']> = useCallback((id, action: 'add' | 'remove') => {
        if (action !== 'remove' || typeof id !== 'string') return;
        removeAlive(id);
    }, []);
    const [names, setNames] = useState(() => getNames(routes));
    useDeepCompareUpdateEffect(() => {
        setNames(() => getNames(routes));
    }, [routes]);
    useDeepCompareEffect(() => {
        setTabs(
            data.map((id) => ({
                key: id,
                label: names[id],
                closable: true,
            })) as TabsProps['items'],
        );
    }, [data]);
    return actived ? (
        <div
            className={`${$styles.container}`}
            style={
                {
                    backgroundColor: colorBgContainer,
                    '--colorBorderSecondary': colorBorderSecondary,
                    '--controlItemBgActive': controlItemBgActive,
                } as Record<string, any>
            }
        >
            <Tabs
                type="editable-card"
                size="small"
                activeKey={actived}
                onChange={changeAlive}
                onEdit={remove}
                tabBarExtraContent={<ExtraButtons actived={actived} />}
                hideAdd
                destroyInactiveTabPane
                items={tabs}
                animated={{ inkBar: true, tabPane: true }}
            />
        </div>
    ) : null;
};
export default KeepLiveTabs;
