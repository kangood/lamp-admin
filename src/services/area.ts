import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { InputType } from '@/views/org/orgs/list.page';
import { globalError, globalSuccess } from '@/utils/antd-extract';
import { ResponseResultType } from '@/utils/types';
import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';

/**
 * 树结构查询
 */
export const useListAreaTree = () => {
    return useQuery(['listAreaTree'], async () =>
        service.get('/area/tree').then((res) => res.data),
    );
};

/**
 * 更新
 */
export const useUpdateArea = () => {
    return useMutation(async (params: InputType) => service.patch('/area', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listAreaTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 新建
 */
export const useCreateArea = () => {
    return useMutation(async (params: InputType) => service.post('/area', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listAreaTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 删除
 */
export const useDeleteMultiArea = () => {
    return useMutation(async (ids: number[]) => service.delete('/area', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listAreaTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};
