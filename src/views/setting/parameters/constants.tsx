import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Checkbox, Space, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

export interface DataType {
    id?: number;
    key?: string;
    name?: string;
    value?: string;
    describe?: string;
    state?: boolean;
    readonly?: boolean;
    createdAt?: string;
    timeRange?: string;
    page?: number;
    limit?: number;
}

interface IProps {
    onOpenFormHandler: (id: number) => void;
    onDelHandler: (ids: number[]) => void;
}

export const columns: ({ onOpenFormHandler, onDelHandler }: IProps) => ColumnsType<DataType> = ({
    onOpenFormHandler,
    onDelHandler,
}) => [
    {
        title: <Checkbox />,
        key: 'checkbox',
        render: () => (
            <Space size="middle">
                <Checkbox.Group options={['']} />
            </Space>
        ),
    },
    {
        title: '参数键',
        dataIndex: 'key',
    },
    {
        title: '参数名称',
        dataIndex: 'name',
        width: 150,
    },
    {
        title: '参数值',
        dataIndex: 'value',
        width: 170,
    },
    {
        title: '描述',
        dataIndex: 'describe',
    },
    {
        title: '状态',
        dataIndex: 'state',
        render: (state) => <Tag color={state ? 'green' : 'volcano'}>{state ? '启用' : '禁用'}</Tag>,
    },
    {
        title: '内置',
        dataIndex: 'readonly',
        render: (readonly) => (
            <Tag color={readonly ? 'green' : 'volcano'}>{readonly ? '是' : '否'}</Tag>
        ),
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
                    onClick={() => onOpenFormHandler(record.id)}
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
