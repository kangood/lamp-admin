import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { InputType, OutputType } from '@/views/org/stations/constants';
import { globalError, globalSuccess } from '@/utils/antdExtract';
import { QueryResultType, ResponseResultType } from '@/utils/types';

/**
 * 分页查询
 */
export const useListStation = () => {
    return useQuery<QueryResultType<OutputType>>(['listStation'], () =>
        axios.get('/station').then((res) => res.data),
    );
};

/**
 * 关联机构的列表查询
 */
export const useListRelate = (values?: InputType) => {
    return useQuery(['listRelate', values], () =>
        axios
            .get('/station/listRelate', {
                params: values,
            })
            .then((res) => res.data),
    );
};

/**
 * 更新岗位
 */
export const useUpdateStation = () => {
    return useMutation(
        async (params: InputType) => axios.patch('/station', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 新建岗位
 */
export const useCreateStation = () => {
    return useMutation(
        async (params: InputType) => axios.post('/station', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};

/**
 * 删除多个岗位
 */
export const useDeleteStation = () => {
    return useMutation(
        async (ids: number[]) =>
            axios.delete('/station', { data: { ids } }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};
