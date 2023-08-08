import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { InputType } from '@/views/org/stations/constants';
import { globalError, globalSuccess } from '@/utils/antdExtract';

/**
 * 关联机构列表查询
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
 * 树结构列表查询
 */
export const useListTree = () => {
    return useQuery([], async () => axios.get('/org/tree').then((res) => res.data));
};

/**
 * 更新单个岗位
 */
export const useUpdateStation = () => {
    return useMutation(
        async (params: InputType) => axios.patch('/station', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};

/**
 * 新建单个岗位
 */
export const useCreateStation = () => {
    return useMutation(
        async (params: InputType) => axios.post('/station', { ...params }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};

/**
 * 删除单个岗位
 */
export const useDeleteStation = () => {
    return useMutation(
        async (ids: number[]) =>
            axios.delete('/station', { data: { ids } }).then((res) => res.data),
        {
            onSuccess: () => globalSuccess(),
            onError: (error: AxiosError) => globalError(error),
        },
    );
};
