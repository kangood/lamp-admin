import { useMutation, useQuery } from '@tanstack/react-query';

import { message } from 'antd';

import { AxiosError } from 'axios';

import { QueryResultType, ResponseResultType } from '@/utils/types';
import { DictMapListType, OutputType } from '@/views/setting/dictionaries/constants';
import { service } from '@/http/axios/service';
import { globalError, globalSuccess } from '@/utils/antd-extract';
import { queryClient } from '@/http/tanstack/react-query';

/**
 * 根据类型查询字典列表
 */
export const useListType = () => {
    return useQuery([], () => fetch('api/dict/listType').then((response) => response.json()));
};

/**
 * 多类型字典列表查询
 */
export const useDictListTypes = (types?: string) => {
    return useQuery<DictMapListType>(['dictListTypes', types], () =>
        service
            .get('/dict/listMultiType', { params: { type: types } })
            .then((response) => response.data),
    );
};

/**
 * 根据ID查询单个字典值
 */
export const useGetDictById = (id: number) => {
    return useQuery([], () => fetch(`api/dict/${id}`).then((response) => response.json()));
};

/**
 * 按单个type查询字典列表
 */
export const useListDictSingleType = (
    clickType: string,
    page?: number,
    limit?: number,
    code?: string,
    name?: string,
) => {
    const { data, isLoading, refetch } = useQuery<QueryResultType<OutputType>>(
        ['listDictSingleType', clickType, page, limit, code, name],
        async () =>
            service
                .get('dict', { params: { type: clickType, page, limit, code, name } })
                .then((res) => res.data),
    );
    return {
        listDataItems: data?.items,
        listMeta: data?.meta,
        listLoading: isLoading,
        listRefetch: refetch,
    };
};

/**
 * 批量删除字典
 */
export const useDelDicts = () => {
    return useMutation(async (ids: number[]) => service.delete('dict', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listDictSingleType']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 更新单个字典值
 */
export const useUpdateDict = () => {
    return useMutation(async (params) => {
        fetch(`api/dict`, {
            method: 'PATCH',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        })
            .then((res) => {
                if (res) message.success('更新成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    });
};

/**
 * 新建单个字典值
 */
export const useCreateDict = () => {
    return useMutation(async (params) => service.post('dict', params), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listDictSingleType']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};
