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
export const useListOrgTree = () => {
    return useQuery(['listOrgTree'], async () => service.get('/org/tree').then((res) => res.data));
};

/**
 * 更新
 */
export const useUpdateOrg = () => {
    return useMutation(async (params: InputType) => service.patch('/org', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listOrgTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 新建
 */
export const useCreateOrg = () => {
    return useMutation(async (params: InputType) => service.post('/org', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listOrgTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 删除
 */
export const useDeleteOrg = () => {
    return useMutation(async (ids: number[]) => service.delete('/org', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listOrgTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};
