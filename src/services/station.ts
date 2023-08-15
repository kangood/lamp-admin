import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { InputType, OutputType } from '@/views/org/stations/constants';
import { globalError, globalSuccess } from '@/utils/antd-extract';
import { QueryResultType, ResponseResultType } from '@/utils/types';
import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';

/**
 * 分页查询
 */
export const useListStation = () => {
    return useQuery<QueryResultType<OutputType>>(['listStation'], () =>
        service.get('/station').then((res) => res.data),
    );
};

/**
 * 关联机构的列表查询
 */
export const useListStationRelate = (values?: InputType) => {
    return useQuery(['listStationRelate', values], async () =>
        service
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
    return useMutation(async (params: InputType) => service.patch('/station', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listStationRelate']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 新建岗位
 */
export const useCreateStation = () => {
    return useMutation(async (params: InputType) => service.post('/station', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listStationRelate']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};

/**
 * 删除多个岗位
 */
export const useDeleteStation = () => {
    return useMutation(async (ids: number[]) => service.delete('/station', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listStationRelate']);
        },
        onError: (error: AxiosError<ResponseResultType>) => globalError(error),
    });
};
