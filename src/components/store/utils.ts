import { capitalize } from 'lodash';
import { create, Mutate, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import {
    subscribeWithSelector,
    devtools,
    persist,
    PersistOptions,
    DevtoolsOptions,
    redux,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { ZustandGetterSelectors, ZustandHookSelectors } from './types';

/**
 * 在nextjs下使用PersistStore，为方便后续写前台而备用
 * */
// export const usePersistStore = <T, F, C = (obja: any, objb: any) => boolean>(
//     store: (callback: (state: T) => unknown, compare?: C) => unknown,
//     callback: (state: T) => F,
//     compare?: C,
// ) => {
//     const result = store(callback, compare) as F;
//     const [data, setData] = useState<F>(result);

//     useEffect(() => {
//         setData(result);
//     }, [result]);

//     return data as F;
// };

/**
 * 创建包含订阅，immer以及devtoools功能的普通状态商店
 * @param creator
 * @param devtoolsOptions
 */
export const createStore = <T extends object>(
    creator: StateCreator<
        T,
        [
            ['zustand/subscribeWithSelector', never],
            ['zustand/immer', never],
            ['zustand/devtools', never],
        ]
    >,
    devtoolsOptions?: DevtoolsOptions,
) => {
    return create<T>()(subscribeWithSelector(immer(devtools(creator, devtoolsOptions))));
};

/**
 * 创建包含订阅，immer以及devtoools功能的普通状态商店
 * 同时支持自动存储到客户端，默认存储到localstorage
 * @param creator
 * @param persistOptions
 * @param devtoolsOptions
 */
export const createPersistStore = <T extends object, P = T>(
    creator: StateCreator<
        T,
        [
            ['zustand/subscribeWithSelector', never],
            ['zustand/immer', never],
            ['zustand/devtools', never],
            ['zustand/persist', P],
        ]
    >,
    persistOptions: PersistOptions<T, P>,
    devtoolsOptions?: DevtoolsOptions,
) => {
    return create<T>()(
        subscribeWithSelector(
            immer(devtools(persist(creator as unknown as any, persistOptions), devtoolsOptions)),
        ),
    );
};

/**
 * 创建包含订阅，immer以及devtoools功能的reducer状态商店
 * 同时支持自动存储到客户端，默认存储到localstorage
 * @param reducer
 * @param initialState
 * @param devtoolsOptions
 */
export const createReduxStore = <
    T extends object,
    A extends {
        type: unknown;
    },
>(
    reducer: (state: T, action: A) => T,
    initialState: T,
    devtoolsOptions?: DevtoolsOptions,
) => create(subscribeWithSelector(immer(devtools(redux(reducer, initialState), devtoolsOptions))));

/**
 * 创建包含订阅，immer以及devtoools功能的reducer状态商店
 * @param reducer
 * @param initialState
 * @param persistOptions
 * @param devtoolsOptions
 */
export const createPersistReduxStore = <
    T extends object,
    A extends {
        type: unknown;
    },
    P = T,
>(
    reducer: (state: T, action: A) => T,
    initialState: T,
    persistOptions: PersistOptions<T, P>,
    devtoolsOptions?: DevtoolsOptions,
) =>
    create(
        subscribeWithSelector(
            immer(
                devtools(
                    persist(redux(reducer, initialState), persistOptions as any),
                    devtoolsOptions,
                ),
            ),
        ),
    );

/**
 * 直接通过getters获取状态值，比如store.getters.xxx()
 * @param store
 */
export function createStoreGetters<T extends object>(
    store: UseBoundStore<
        Mutate<
            StoreApi<T>,
            [
                ['zustand/subscribeWithSelector', never],
                ['zustand/immer', never],
                ['zustand/devtools', never],
            ]
        >
    >,
) {
    const storeIn = store as any;

    storeIn.getters = {};
    Object.keys(storeIn.getState()).forEach((key) => {
        const selector = (state: T) => state[key as keyof T];
        storeIn.getters[key] = () => storeIn(selector);
    });

    return storeIn as typeof store & ZustandGetterSelectors<T>;
}

/**
 * 直接通过类似hooks的方法获取状态值，比如store.useXxx()
 * @param store
 */
export function createStoreHooks<T extends Record<string, any>>(
    store: UseBoundStore<
        Mutate<
            StoreApi<T>,
            [
                ['zustand/subscribeWithSelector', never],
                ['zustand/immer', never],
                ['zustand/devtools', never],
            ]
        >
    >,
) {
    const storeIn = store as any;

    Object.keys(storeIn.getState()).forEach((key) => {
        const selector = (state: T) => state[key as keyof T];
        storeIn[`use${capitalize(key)}`] = () => storeIn(selector);
    });

    return storeIn as typeof store & ZustandHookSelectors<T>;
}
