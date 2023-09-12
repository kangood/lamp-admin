import { useMutation, useQuery } from '@tanstack/react-query';

import { service } from '@/http/axios/service';
import { globalSuccess } from '@/utils/antd-extract';
import { InputType } from '@/views/setting/roles/resource-allot.page';
import { queryClient } from '@/http/tanstack/react-query';

/**
 * 分组菜单和资源的查询
 */
export const useListRoleAuthorityId = (values?: InputType) => {
    return useQuery(['listRoleAuthorityId', values], () =>
        service
            .get('role-authority/listRoleAuthorityId', { params: values })
            .then((res) => res.data),
    );
};

/**
 * 保存角色授权数据，删除再批量插入
 */
export const useSaveBatchRoleAutority = () => {
    return useMutation(
        async (params: InputType) =>
            service.post('role-authority/saveBatchRoleAutority', { ...params }),
        {
            onSuccess: () => {
                globalSuccess();
                queryClient.invalidateQueries(['listRoleAuthorityId']);
            },
        },
    );
};
