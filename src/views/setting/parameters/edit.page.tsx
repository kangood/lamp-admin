import { Form, Input, Modal, Radio, Spin, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import config from '../../../../public/config.json';

import { DataType } from './constants';

interface CollectionEditFormProps {
    id: number;
    onClose: (isReload?: boolean) => void;
}

export const CollectionEditForm: React.FC<CollectionEditFormProps> = ({ id, onClose }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState<DataType>();
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);
    // 初始加载列表查询方法
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            setLoading(true);
            axios
                .get(`${config.api.baseUrl}/param${id === 0 ? '' : `/${id}`}`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                })
                .then((res) => {
                    if (res) {
                        setData(res.data);
                    }
                })
                .catch((err) => {
                    message.error(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);
    // 加载中状态，用于请求之后再展示数据
    if (loading) return <Spin />;
    // 点击提交按钮的处理
    const submitHandle = async () => {
        const values = await form.validateFields();
        if (id) {
            updateRequest(values);
        } else {
            createRequest(values);
        }
    };
    // 更新请求
    const updateRequest = (values: DataType) => {
        values.id = id;
        axios
            .patch(`${config.api.baseUrl}/param`, {
                ...values,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((res) => {
                // 重置表单项，关闭窗口
                form.resetFields();
                onClose();
                // Antd全局提示
                if (res) message.success('提交成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    // 新增请求
    const createRequest = (values: DataType) => {
        axios
            .post(`${config.api.baseUrl}/param`, {
                ...values,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((res) => {
                form.resetFields();
                onClose();
                if (res) message.success('提交成功');
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    return (
        <Modal
            open
            title={id ? '编辑' : '新建'}
            okText="提交"
            cancelText="取消"
            onCancel={() => onClose()}
            onOk={submitHandle}
        >
            <Form form={form} layout="vertical" name="form_in_modal" initialValues={data}>
                <Form.Item
                    name="key"
                    label="参数键"
                    rules={[{ required: true, message: '请填写参数键' }]}
                >
                    <Input disabled={!!id} />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="参数名称"
                    rules={[{ required: true, message: '请填写参数名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="value"
                    label="参数值"
                    rules={[{ required: true, message: '请填写参数值' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="describe" label="描述">
                    <Input />
                </Form.Item>
                <Form.Item name="state" label="状态" initialValue={id ? data?.state : true}>
                    <Radio.Group buttonStyle="solid">
                        <Radio.Button value defaultChecked>
                            启用
                        </Radio.Button>
                        <Radio.Button value={false}>禁用</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="readonly" label="内置" initialValue={id ? data?.readonly : false}>
                    <Radio.Group buttonStyle="solid">
                        <Radio.Button value>是</Radio.Button>
                        <Radio.Button value={false} defaultChecked>
                            否
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};
