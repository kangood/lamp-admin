import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { InputType, OutputType } from '@/views/setting/menus/list.page';
import { globalError, globalSuccess } from '@/utils/antd-extract';
import { ResponseResultType } from '@/utils/types';
import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';
import { traverseTree } from '@/views/setting/roles/resource-allot.page';

/**
 * 树结构查询
 */
export const useListMenuTree = () => {
    const { data } = useQuery<OutputType[]>(['listMenuTree'], async () =>
        service.get('/menu/tree').then((res) => res.data),
    );
    const dataAfterProcessLabel = () => {
        if (data) {
            data.forEach((rootNode) => {
                traverseTree(rootNode);
            });
        }
        return { data };
    };
    return { data, dataAfterProcessLabel };
};

/**
 * 更新
 */
export const useUpdateMenu = () => {
    return useMutation(async (params: InputType) => service.patch('/menu', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listMenuTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 新建
 */
export const useCreateMenu = () => {
    return useMutation(async (params: InputType) => service.post('/menu', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listMenuTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 删除
 */
export const useDeleteMenu = () => {
    return useMutation(async (ids: number[]) => service.delete('/menu', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listMenuTree']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};
