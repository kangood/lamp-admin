import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { InputType } from '@/views/org/orgs/list.page';
import { globalError, globalSuccess } from '@/utils/antdExtract';

/**
 * 树结构查询
 */
export const useListTree = () => {
    return useQuery([], async () => axios.get('/org/tree').then((res) => res.data));
};

/**
 * 单个查询
 */
export const useGetOne = (id: number) => {
    return useQuery(['getOne', id], async () => axios.get(`/org/${id}`).then((res) => res.data));
};

/**
 * 更新
 */
export const useUpdateOne = () => {
    return useMutation(
        async (params: InputType) => axios.patch('/org', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};

/**
 * 新建
 */
export const useCreateOne = () => {
    return useMutation(
        async (params: InputType) => axios.post('/org', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};

/**
 * 删除
 */
export const useDeleteOne = () => {
    return useMutation(
        async (ids: number[]) => axios.delete('/org', { data: { ids } }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};
