import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

export interface InputType {
    name?: string;
    orgId?: number;
    timeRange?: string;
    rangePicker?: string;
    state?: boolean;
    describe?: string;
    page?: number;
    limit?: number;
}

export interface OutputType {
    key?: React.Key;
    id?: number;
    name?: string;
    password?: string;
    orgId?: number;
    orgMap?: OutputType;
    state?: boolean;
    describe?: string;
    deletedAt?: Date;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
    createdOrgId?: number;
}

interface IProps {
    onOpenFormHandler: (clickOne: OutputType) => void;
    onDelHandler: (ids: number[]) => void;
}

const translateSex = (sex: string) => {
    if (sex === 'M') {
        return '男';
    }
    if (sex === 'W') {
        return '女';
    }
    return '未知';
};

export const columns: ({ onOpenFormHandler, onDelHandler }: IProps) => ColumnsType<OutputType> = ({
    onOpenFormHandler,
    onDelHandler,
}) => [
    {
        title: '头像',
        dataIndex: 'avatar',
        render: (avatar) => <Avatar src={`${avatar}`} />,
    },
    {
        title: '账号',
        dataIndex: 'account',
    },
    {
        title: '姓名',
        dataIndex: 'name',
    },
    {
        title: '性别',
        dataIndex: 'sex',
        render: (sex) => <Tag color={sex === 'M' ? 'green' : 'red'}>{translateSex(sex)}</Tag>,
    },
    {
        title: '邮箱',
        dataIndex: 'email',
    },
    {
        title: '民族',
        dataIndex: 'userEchoDto',
        key: 'nation',
        render: (userEchoDto) => userEchoDto?.nation,
    },
    {
        title: '学历',
        dataIndex: 'userEchoDto',
        key: 'education',
        render: (userEchoDto) => userEchoDto?.education,
    },
    {
        title: '职位状态',
        dataIndex: 'userEchoDto',
        key: 'positionStatus',
        render: (userEchoDto) => userEchoDto?.positionStatus,
    },
    {
        title: '机构',
        dataIndex: 'orgMap',
        key: 'orgId',
        render: (orgMap) => (orgMap?.type === '01' ? orgMap?.abbreviation : orgMap?.label),
    },
    {
        title: '岗位',
        dataIndex: 'stationMap',
        key: 'stationId',
        render: (stationMap) => stationMap?.name,
    },
    {
        title: '状态',
        dataIndex: 'state',
        render: (state) => <Tag color={state ? 'green' : 'volcano'}>{state ? '启用' : '禁用'}</Tag>,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onOpenFormHandler(record)}
                />
                <Button
                    key="del"
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => onDelHandler([record.id])}
                />
            </Space>
        ),
    },
];
