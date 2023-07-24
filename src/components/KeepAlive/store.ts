import { produce } from 'immer';
// import { equals, filter, find, findIndex, includes, not } from 'ramda';
import { Reducer } from 'react';

import { filter, findIndex } from 'lodash';

import { createReduxStore } from '../store';

import { AliveActionType } from './constants';

import { KeepAliveAction, KeepAliveStoreType } from './types';

const keepAliveReducer: Reducer<KeepAliveStoreType, KeepAliveAction> = produce((state, action) => {
    switch (action.type) {
        case AliveActionType.ADD: {
            const lives = [...state.lives];
            if (lives.some((item) => item === action.id && state.active === action.id)) return;
            const isNew = !lives.filter((item) => item === action.id).length;
            if (isNew) {
                if (lives.length >= state.maxLen) state.lives.shift();
                state.lives.push(action.id);
                state.active = action.id;
            }
            break;
        }
        case AliveActionType.REMOVE: {
            const { id, navigate } = action.params;
            const index = findIndex(state.lives, (item) => item === id);
            if (index === -1) return;
            const toRemove = state.lives[index];
            state.lives.splice(index, 1);
            if (state.active === toRemove) {
                if (state.lives.length < 1) {
                    navigate(state.path);
                } else {
                    const toActiveIndex = index > 0 ? index - 1 : index;
                    state.active = state.lives[toActiveIndex];
                    navigate({ id: state.active });
                }
            }
            break;
        }
        case AliveActionType.REMOVE_MULTI: {
            const { ids, navigate } = action.params;
            state.lives = filter(state.lives, (item) => !ids.includes(item));
            if (state.lives.length < 1) navigate(state.path);
            break;
        }
        case AliveActionType.CLEAR: {
            state.lives = [];
            action.navigate(state.path);
            break;
        }
        case AliveActionType.ACTIVE: {
            const current = state.lives.find((item) => item === action.id);
            if (current && state.active !== current) state.active = current;
            break;
        }
        case AliveActionType.CHANGE: {
            const { id, navigate } = action.params;
            const current = state.lives.find((item) => item === id);
            if (!current || state.active === id) return;
            navigate({ id });
            break;
        }
        case AliveActionType.RESET: {
            const { id } = action.params;
            state.reset = id;
            break;
        }
        default:
            break;
    }
});

export const KeepAliveStore = createReduxStore(keepAliveReducer, {
    path: '/',
    active: null,
    include: [],
    exclude: [],
    maxLen: 10,
    lives: [],
    reset: null,
    setuped: false,
});
