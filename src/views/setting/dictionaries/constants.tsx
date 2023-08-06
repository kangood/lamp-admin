import { DeleteOutlined, EditOutlined } from '@ant-design/icons/lib/icons';
import { Button, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

export interface InputType {
    code: string;
    name: string;
}

export interface OutputType {
    id?: number;
    type: string;
    label: string;
    code?: string;
    name?: string;
    state?: boolean;
    describe?: string;
    sortValue?: number;
    icon?: string;
    cssStyle?: string;
    cssClass?: string;
    readonly?: boolean;
    createdBy?: number;
    updatedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

interface IProps {
    onOpenFormHandler: (clickDict: OutputType) => void;
    onDelHandler: (ids: number[]) => void;
}

export const listTypeColumns: ({
    onOpenFormHandler,
    onDelHandler,
}: IProps) => ColumnsType<OutputType> = ({ onOpenFormHandler, onDelHandler }) => [
    {
        title: '类型',
        dataIndex: 'type',
        width: 120,
        ellipsis: true,
    },
    {
        title: '类型标签',
        dataIndex: 'label',
    },
    {
        title: '状态',
        dataIndex: 'state',
        width: 70,
        render: (state) => <Tag color={state ? 'green' : 'volcano'}>{state ? '启用' : '禁用'}</Tag>,
    },
    {
        title: '操作',
        key: 'action',
        width: 90,
        render: (_, record) => (
            <Space size={0}>
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

export const listColumns: ({
    onOpenFormHandler,
    onDelHandler,
}: IProps) => ColumnsType<OutputType> = ({ onOpenFormHandler, onDelHandler }) => [
    {
        title: '编码',
        dataIndex: 'code',
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '描述',
        dataIndex: 'describe',
    },
    {
        title: '状态',
        dataIndex: 'state',
        width: 70,
        render: (state) => <Tag color={state ? 'green' : 'volcano'}>{state ? '启用' : '禁用'}</Tag>,
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        width: 200,
    },
    {
        title: '操作',
        key: 'action',
        width: 90,
        render: (_, record) => (
            <Space size={0}>
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
