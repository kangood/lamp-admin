import { Button, Form, Input, InputNumber, Radio } from 'antd';

import { useEffect } from 'react';

import { useCreateOne, useUpdateOne } from '@/services/org';

import { InputType } from './list.page';

interface OrgEditFormProps {
    clickOne: InputType;
    refetch: () => void;
}

export const OrgEditForm: React.FC<OrgEditFormProps> = ({ clickOne, refetch }) => {
    const [form] = Form.useForm();
    const { mutateAsync: updateMutate } = useUpdateOne();
    const { mutateAsync: createMutate } = useCreateOne();
    useEffect(() => {
        form.resetFields();
        form.setFieldsValue(clickOne);
    }, [clickOne]);

    // 表单提交并刷新
    const onFinishHandler = async (values: InputType) => {
        if (values.id) {
            await updateMutate(values);
        } else {
            await createMutate(values);
        }
        refetch();
    };
    return (
        <Form
            form={form}
            layout="vertical"
            name="form_in_inside"
            initialValues={clickOne}
            onFinish={onFinishHandler}
        >
            <Form.Item name="id" hidden />
            {!clickOne.id && <Form.Item name="parent" hidden />}
            <Form.Item name="parentId" label="上级ID">
                <Input disabled />
            </Form.Item>
            <Form.Item
                name="label"
                label="机构名称"
                rules={[{ required: true, message: '机构名称不能为空' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="abbreviation" label="简称">
                <Input />
            </Form.Item>
            <Form.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: '类型不能为空' }]}
            >
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value="01">单位</Radio.Button>
                    <Radio.Button value="02">部门</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="describe" label="描述">
                <Input />
            </Form.Item>
            <Form.Item name="state" label="状态">
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value defaultChecked>
                        启用
                    </Radio.Button>
                    <Radio.Button value={false}>禁用</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="sortValue" label="排序">
                <InputNumber />
            </Form.Item>
            <Form.Item>
                <Button danger type="dashed" size="large" htmlType="submit">
                    {clickOne.id ? '修改' : '新增'}
                </Button>
            </Form.Item>
        </Form>
    );
};
