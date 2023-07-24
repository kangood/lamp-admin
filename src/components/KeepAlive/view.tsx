import ReactDOM from 'react-dom';
import { isNil, filter, map, findIndex } from 'lodash';
import { useUpdate, useUpdateEffect } from 'ahooks';
import {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react';

import { matchRoutes, useLocation, useOutlet } from 'react-router-dom';

import { useUnmount } from 'react-use';

import { deepMerge } from '@/utils';

import { useNavigator } from '../router/hooks';

import { RouterStore } from '../router/store';

import { factoryRoutes } from '../router/utils';

import { AlivePageProps } from './types';
import { AliveActionType, KeepAliveDispatchContext, KeepAliveIdContext } from './constants';
import { KeepAliveStore } from './store';

interface ParentRef {
    refresh: (resetId: string) => void;
}
const KeepOutlet: FC<{ id: string }> = ({ id }) => {
    const outlet = useOutlet();
    return useMemo(
        () => <KeepAliveIdContext.Provider value={id}>{outlet}</KeepAliveIdContext.Provider>,
        [],
    );
};
// 渲染 当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
const KeepPage: FC<AlivePageProps & { children: ReactNode }> = ({
    isActive,
    children,
    id,
    renderDiv,
}) => {
    const [targetElement] = useState(() => document.createElement('div'));
    const activatedRef = useRef(false);
    activatedRef.current = activatedRef.current || isActive;
    // 根据当前页面是否被激活来移除页面的DOM
    useEffect(() => {
        if (isActive) {
            renderDiv.current?.appendChild(targetElement);
        } else {
            try {
                renderDiv.current?.removeChild(targetElement);
                // eslint-disable-next-line no-empty
            } catch (e) {}
        }
    }, [isActive, id, renderDiv, targetElement]);
    useEffect(() => {
        // 添加一个id 作为标识 并没有什么太多作用
        targetElement.setAttribute('id', id);
    }, [id, targetElement]);
    // 如果处于激活状态则把vnode渲染到document.createElement('div') 里面
    return <>{activatedRef.current && ReactDOM.createPortal(children, targetElement)}</>;
};

const KeepContainer = forwardRef<ParentRef, { active: string; reset: string | null }>(
    ({ active, reset }, ref) => {
        const { exclude, include, maxLen } = KeepAliveStore(
            useCallback((state) => ({ ...state }), []),
        );
        const redo = useRef<number | null>(null);
        const containerRef = useRef<HTMLDivElement>(null);
        const pages = useRef<
            Array<{
                id: string;
                component: ReactNode;
            }>
        >([]);
        const update = useUpdate();
        useImperativeHandle(
            ref,
            () => ({
                refresh: (resetId) => {
                    if (!isNil(resetId) && isNil(redo.current)) {
                        redo.current = findIndex(pages.current, (item) => item.id === resetId);
                        pages.current = pages.current.filter(({ id }) => id !== resetId);
                    }
                },
            }),
            [],
        );
        useLayoutEffect(() => {
            if (isNil(reset) || isNil(redo.current)) return;
            pages.current.splice(redo.current, 0, {
                id: reset,
                component: <KeepOutlet id={reset} />,
            });
            redo.current = null;
            update();
        }, [reset]);
        useLayoutEffect(() => {
            if (isNil(active)) return;
            // 缓存超过上限的 干掉第一个缓存
            if (pages.current.length >= maxLen) {
                pages.current = pages.current.slice(1);
            }
            // 如果当前激活的标签页不在pages中则添加它
            const page = pages.current.find((item) => item.id === active);
            if (isNil(page)) {
                pages.current = [
                    ...pages.current,
                    {
                        id: active,
                        component: <KeepOutlet id={active} />,
                    },
                ];
                update();
            }
            // eslint-disable-next-line consistent-return
            return () => {
                // 处理 黑白名单
                if (isNil(exclude) && isNil(include)) return;
                pages.current = filter(pages.current, ({ id }) => {
                    if (exclude && exclude.includes(id)) return false;
                    if (include) return include.includes(id);
                    return true;
                });
            };
        }, [active, exclude, maxLen, include]);

        return (
            <>
                <div ref={containerRef} className="keep-alive" />
                {map(pages.current, ({ id, component }) => (
                    <KeepPage isActive={id === active} renderDiv={containerRef} id={id} key={id}>
                        {component}
                    </KeepPage>
                ))}
            </>
        );
    },
);

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigator();
    const { path, reset } = KeepAliveStore(useCallback((state) => ({ ...state }), []));
    const [isRoot, setIsRoot] = useState(true);
    const [resetId, setResetId] = useState<string | null>(null);
    const ref = useRef<ParentRef | null>(null);
    // 计算 匹配的路由id
    const matchRouteId = useMemo(() => {
        const { config, routes, flat } = RouterStore.getState();
        const matches = matchRoutes(factoryRoutes(routes), location, config.basename);
        if (isNil(matches) || matches.length < 1) return null;
        const match = matches[matches.length - 1];
        const item = flat.find((f) => f.id === (match.route as any).id);
        if (!item) return null;
        return item.id;
    }, [location]);
    // 缓存渲染 & 判断是否404
    useEffect(() => {
        const { flat } = RouterStore.getState();
        const matchItem = flat.find((item) => item.id === matchRouteId);
        const checkRoot = !!(
            matchItem &&
            matchItem.path === path &&
            (!matchItem.index || (matchItem.index && isNil(matchItem.page)))
        );
        setIsRoot(checkRoot);
        if (checkRoot) return;
        if (matchRouteId) {
            KeepAliveStore.dispatch({ type: AliveActionType.ADD, id: matchRouteId });
            KeepAliveStore.dispatch({ type: AliveActionType.ACTIVE, id: matchRouteId });
        } else if (location.pathname !== path) {
            // navigate({ pathname: notFound });
        }
    }, [matchRouteId, location, navigate]);
    useUpdateEffect(() => {
        setResetId(reset);
        if (isNil(reset)) return;
        ref.current && ref.current.refresh(reset);
        KeepAliveStore.dispatch({
            type: AliveActionType.RESET,
            params: { id: null },
        });
    }, [reset]);
    return isRoot || isNil(matchRouteId) ? (
        <>{children}</>
    ) : (
        <KeepAliveDispatchContext.Provider value={KeepAliveStore.dispatch}>
            <KeepContainer active={matchRouteId} reset={resetId} ref={ref} />
        </KeepAliveDispatchContext.Provider>
    );
};

const KeepAlive: FC<{ children: ReactNode }> = ({ children }) => {
    const config = RouterStore((state) => state.config);
    const setuped = KeepAliveStore((state) => state.setuped);
    const listenLives = KeepAliveStore.subscribe(
        (state) => state.lives,
        (lives) => {
            KeepAliveStore.setState((state) => {
                state.include = lives;
            });
        },
    );
    useEffect(() => {
        if (!setuped) {
            KeepAliveStore.setState(
                (state) =>
                    deepMerge(
                        state,
                        {
                            path: config.basename,
                            notFound: config.notFound,
                            setuped: true,
                        },
                        'replace',
                    ),
                true,
            );
        }
    }, [config.basename, config.notFound, setuped]);
    useUnmount(() => {
        listenLives();
    });
    return <Provider>{children}</Provider>;
};
export default KeepAlive;
