import { useMutation, useQuery } from '@tanstack/react-query';

import { InputType } from '@/views/org/stations/constants';
import { globalSuccess } from '@/utils/antd-extract';
import { service } from '@/http/axios/service';
import { queryClient } from '@/http/tanstack/react-query';

/**
 * 列表查询
 */
export const useListOssc = (values?: InputType) => {
    return useQuery(['listOssc', values], () =>
        service
            .get('/ossc', {
                params: values,
            })
            .then((res) => res.data),
    );
};

/**
 * 更新
 */
export const useUpdateOssc = () => {
    return useMutation(async (params: InputType) => service.patch('/ossc', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listOssc']);
        },
    });
};

/**
 * 新建用户
 */
export const useCreateOssc = () => {
    return useMutation(async (params: InputType) => service.post('/ossc', { ...params }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listOssc']);
        },
    });
};

/**
 * 删除多个用户
 */
export const useDeleteOssc = () => {
    return useMutation(async (ids: number[]) => service.delete('/ossc', { data: { ids } }), {
        onSuccess: () => {
            globalSuccess();
            queryClient.invalidateQueries(['listOssc']);
        },
    });
};
