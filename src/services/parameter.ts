import { useMutation } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import useFetch from '@/hooks/useFetch';
import { service } from '@/http/axios/service';
import { globalError, globalSuccess } from '@/utils/antd-extract';
import { ResponseResultType } from '@/utils/types';

/**
 * 查询参数带分页
 */
export const useParameters = () => {
    const { data, loading, error } = useFetch('api/param', {});
    if (loading) return 'Loading...';
    if (error) return 'Oops!';
    return {
        data,
        // meta: data?.meta,
        loading,
        error,
    };
};

/**
 * 批量删除
 */
export const useDeleteParam = () => {
    return useMutation(async (ids: number[]) => service.delete('param', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};
