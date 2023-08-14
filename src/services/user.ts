import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { InputType } from '@/views/org/stations/constants';
import { globalError, globalSuccess } from '@/utils/antdExtract';
import { ResponseResultType } from '@/utils/types';
import { service } from '@/http/axios/service';

/**
 * 关联其他的列表查询
 */
export const useListUserRelate = (values?: InputType) => {
    return useQuery(['listRelate', values], () =>
        service
            .get('/user/listRelate', {
                params: values,
            })
            .then((res) => res.data),
    );
};

/**
 * 更新用户
 */
export const useUpdateUser = () => {
    return useMutation(
        async (params: InputType) => service.patch('/user', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 新建用户
 */
export const useCreateUser = () => {
    return useMutation(
        async (params: InputType) => service.post('/user', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 删除多个用户
 */
export const useDeleteUser = () => {
    return useMutation(
        async (ids: number[]) => service.delete('/user', { data: { ids } }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};
