import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { InputType } from '@/views/org/orgs/list.page';
import { globalError, globalSuccess } from '@/utils/antdExtract';
import { ResponseResultType } from '@/utils/types';
import { service } from '@/http/axios/service';

/**
 * 树结构查询
 */
export const useListAreaTree = () => {
    return useQuery([], async () => service.get('/area/tree').then((res) => res.data));
};

/**
 * 更新
 */
export const useUpdateArea = () => {
    return useMutation(
        async (params: InputType) => service.patch('/area', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 新建
 */
export const useCreateArea = () => {
    return useMutation(
        async (params: InputType) => service.post('/area', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 删除
 */
export const useDeleteMultiArea = () => {
    return useMutation(
        async (ids: number[]) => service.delete('/area', { data: { ids } }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};
