import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { InputType } from '@/views/org/orgs/list.page';
import { globalError, globalSuccess } from '@/utils/antdExtract';

/**
 * 树结构查询
 */
export const useAreaListTree = () => {
    return useQuery([], async () => axios.get('/area/tree').then((res) => res.data));
};

/**
 * 更新
 */
export const useUpdateArea = () => {
    return useMutation(
        async (params: InputType) => axios.patch('/area', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};

/**
 * 新建
 */
export const useCreateArea = () => {
    return useMutation(
        async (params: InputType) => axios.post('/area', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};

/**
 * 删除
 */
export const useDeleteMultiArea = () => {
    return useMutation(
        async (ids: number[]) => axios.delete('/area', { data: { ids } }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};
