import { Button, Card, Col, Form, Input, Row, Tree } from 'antd';
import { useState } from 'react';

import { useDeleteOne, useListTree } from '@/services/org';

import { OrgEditForm } from './edit.page';

export interface InputType {
    id?: number;
    // 生成树用
    parent?: number;
    // 展示用
    parentId?: number;
    label?: string;
    abbreviation?: string;
    type?: string;
    describe?: string;
    state?: boolean;
    sortValue?: number;
}

export interface OutputType {
    id?: number;
    parent?: OutputType;
    children?: OutputType[];
    depth?: number;
    label?: string;
    type?: string;
    abbreviation?: string;
    parentId?: number;
    sortValue?: number;
    state?: boolean;
    describe?: string;
    deletedAt?: Date;
    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    updatedBy?: number;
}

interface CheckedKeysType {
    checked: number[];
    halfChecked: number[];
}

export default () => {
    const [form] = Form.useForm();
    const defaultClickOne: InputType = { type: '01', state: true };
    // 状态定义
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<CheckedKeysType>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [clickOne, setClickOne] = useState<InputType>(defaultClickOne);
    // API-hook
    const { data: listTree, refetch } = useListTree();
    const { mutateAsync } = useDeleteOne();
    // ==========逻辑处理==========
    // 树结构展开处理
    const onExpand = (expandedKeysValue: React.Key[]) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    // 复选框点击时处理
    const onCheck = (checked: CheckedKeysType) => {
        setCheckedKeys(checked);
    };
    // 树节点点击时处理
    const onSelect = async (selectedKeysValue: React.Key[], info: any) => {
        if (selectedKeysValue && selectedKeysValue.length > 0) {
            setSelectedKeys(selectedKeysValue);
            setClickOne(info.selectedNodes[0]);
        }
    };
    // 点击新增时的处理
    const addHandler = () => {
        defaultClickOne.parent = clickOne.id;
        defaultClickOne.parentId = clickOne.id;
        setClickOne(defaultClickOne);
    };
    // 点击删除时的处理
    const delHandler = async () => {
        if (checkedKeys?.checked) {
            await mutateAsync(checkedKeys?.checked);
            refetch();
        }
    };
    // 刷新处理
    const refetchHandler = () => {
        refetch();
    };
    return (
        <div>
            <Row>
                <Col>
                    <Form form={form}>
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item name="name">
                                    <Input placeholder="机构名称" allowClear />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="search">
                                    <Button type="primary" htmlType="submit">
                                        搜索
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Button type="primary">重置</Button>
                            </Col>
                            <Col span={4}>
                                <Button type="primary" onClick={addHandler}>
                                    添加
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button type="primary" onClick={delHandler}>
                                    删除
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card style={{ width: 650 }}>
                        {listTree && (
                            <Tree
                                checkable
                                checkStrictly
                                // 默认展开所有树节点
                                defaultExpandAll
                                // 展开/收起节点时触发
                                onExpand={onExpand}
                                // （受控）展开指定的树节点
                                expandedKeys={expandedKeys}
                                // 是否自动展开父节点
                                autoExpandParent={autoExpandParent}
                                // 点击复选框触发
                                onCheck={onCheck}
                                // （受控）选中复选框的树节点
                                checkedKeys={checkedKeys}
                                // 点击树节点触发
                                onSelect={onSelect}
                                // （受控）设置选中的树节点
                                selectedKeys={selectedKeys}
                                treeData={listTree}
                                fieldNames={{ title: 'label', key: 'id' }}
                            />
                        )}
                    </Card>
                </Col>
                <Col>
                    <Card title={clickOne.id ? '修改' : '新增'} style={{ width: 600 }}>
                        <OrgEditForm clickOne={clickOne} refetch={refetchHandler} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
