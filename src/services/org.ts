import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { InputType } from '@/views/org/orgs/list.page';
import { globalError, globalSuccess } from '@/utils/antdExtract';
import { ResponseResultType } from '@/utils/types';
import { service } from '@/http/axios/service';

/**
 * 树结构查询
 */
export const useListOrgTree = () => {
    return useQuery(['listOrgTree'], async () => service.get('/org/tree').then((res) => res.data));
};

/**
 * 单个查询
 */
export const useGetOne = (id: number) => {
    return useQuery(['getOne', id], async () => service.get(`/org/${id}`).then((res) => res.data));
};

/**
 * 更新
 */
export const useUpdateOne = () => {
    return useMutation(
        async (params: InputType) => service.patch('/org', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 新建
 */
export const useCreateOne = () => {
    return useMutation(
        async (params: InputType) => service.post('/org', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 删除
 */
export const useDeleteOne = () => {
    return useMutation(
        async (ids: number[]) => service.delete('/org', { data: { ids } }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};
