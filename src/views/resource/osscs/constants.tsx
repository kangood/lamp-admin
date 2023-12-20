import { DeleteOutlined, DiffOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

export interface InputType {
    name?: string;
    orgId?: number;
    timeRange?: string;
    rangePicker?: string;
    state?: boolean;
    workDescribe?: string;
    page?: number;
    limit?: number;
}

export interface OutputType {
    key?: React.Key;
    id?: number;
    account?: string;
    name?: string;
    email?: string;
    password?: string;
    mobile?: string;
    orgId?: number;
    stationId?: number;
    sex?: string;
    state?: boolean;
    workDescribe?: string;
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
    onOpenDetailHanler: (clickOne: OutputType) => void;
}

export const translateSex = (sex: string | undefined) => {
    if (sex === 'M') {
        return '男';
    }
    if (sex === 'W') {
        return '女';
    }
    return '未知';
};

export const columns: ({
    onOpenFormHandler,
    onDelHandler,
    onOpenDetailHanler,
}: IProps) => ColumnsType<OutputType> = ({
    onOpenFormHandler,
    onDelHandler,
    onOpenDetailHanler,
}) => [
    {
        title: '种类',
        dataIndex: 'category',
        render: (category) => <Tag color="blue">{category}</Tag>,
        width: 65,
        fixed: 'left',
    },
    {
        title: '资源编码',
        dataIndex: 'code',
        fixed: 'left',
        width: 105,
    },
    {
        title: '资源地址',
        dataIndex: 'endpoint',
        fixed: 'left',
        width: 100,
    },
    {
        title: '空间名',
        dataIndex: 'bucketName',
        fixed: 'left',
        width: 75,
    },
    {
        title: 'accessKey',
        dataIndex: 'accessKey',
        fixed: 'left',
        width: 175,
    },
    {
        title: 'secretKey',
        dataIndex: 'secretKey',
        fixed: 'left',
        width: 175,
    },
    {
        title: '描述',
        dataIndex: 'description',
        fixed: 'left',
        width: 175,
    },
    {
        title: '状态',
        dataIndex: 'state',
        render: (state) => <Tag color={state ? 'green' : 'volcano'}>{state ? '启用' : '禁用'}</Tag>,
        width: 80,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 180,
        render: (_, record) => (
            <Space size="small">
                <Button
                    key="detail"
                    type="text"
                    icon={<DiffOutlined />}
                    onClick={() => onOpenDetailHanler(record)}
                />
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
                    onClick={() => onDelHandler([record.id!])}
                />
            </Space>
        ),
    },
];
