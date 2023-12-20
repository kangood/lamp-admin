import { Descriptions, DescriptionsProps, Modal } from 'antd';

import { OutputType, translateSex } from './constants';

interface UserDetailPageProps {
    clickOne?: OutputType;
    onClose: () => void;
}

export const UserDetailPage: React.FC<UserDetailPageProps> = ({ clickOne, onClose }) => {
    const items: DescriptionsProps['items'] = [
        {
            key: 'account',
            label: '账号',
            children: clickOne?.account,
        },
        {
            key: 'name',
            label: '姓名',
            children: clickOne?.name,
        },
        {
            key: 'email',
            label: '邮箱',
            children: clickOne?.email,
        },
        {
            key: 'mobile',
            label: '电话',
            children: clickOne?.mobile,
        },
        {
            key: 'sex',
            label: '性别',
            children: translateSex(clickOne?.sex),
        },
        {
            key: 'state',
            label: '状态',
            children: clickOne?.state ? '启用' : '禁用',
        },
        {
            key: 'workDescribe',
            label: '个人描述',
            children: clickOne?.workDescribe,
        },
        {
            key: 'createdAt',
            label: '创建时间',
            span: 3,
            children: clickOne?.createdAt?.toString(),
        },
        {
            key: 'updatedAt',
            label: '修改时间',
            span: 3,
            children: clickOne?.updatedAt?.toString(),
        },
        {
            key: 'lastLoginTime',
            label: '最后登录时间',
            children: '',
        },
        {
            key: 'passwordExpireTime',
            label: '密码过期时间',
            children: '',
        },
        {
            key: 'passwordErrorLastTime',
            label: '最后一次输错密码时间',
            children: '',
        },
        {
            key: 'passwordErrorNum',
            label: '密码错误次数',
            children: '',
        },
    ];
    return (
        <Modal onCancel={() => onClose()} open footer={null}>
            <Descriptions title="用户详情" layout="vertical" items={items} />
        </Modal>
    );
};
