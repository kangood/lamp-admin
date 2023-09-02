import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Row, Space, Tree, message } from 'antd';

import { useMemo } from 'react';

import { DataNode } from 'antd/es/tree';

import { RESOURCE_TYPE_MENU } from '@/utils/constants';

import { useListMenuTree } from '@/services/menu';

import { OutputType } from '../menus/list.page';

interface ResourceAllotPageProps {
    clickRoleId: number;
    onClose: () => void;
}

/**
 * 递归遍历数结构
 */
export const traverseTree = (node: OutputType) => {
    // 处理节点的标签值
    node.label = `${node.resourceType === RESOURCE_TYPE_MENU ? '「菜单」' : '「资源」'}${
        node.label
    }`;
    // 递归处理子节点
    node.children = node.children?.map((childNode) => traverseTree(childNode));
    return node;
};

export const ResourceAllotPage: React.FC<ResourceAllotPageProps> = ({ onClose }) => {
    const [form] = Form.useForm();
    const { data: listMenuTree } = useListMenuTree();
    useMemo(() => {
        if (listMenuTree) {
            console.log(123);
            listMenuTree.map((rootNode) => {
                return traverseTree(rootNode);
            });
        }
    }, [listMenuTree]);
    // 复选框点击时处理
    const onCheck = (checked: React.Key[] | { checked: React.Key[] }) => {
        if (!Array.isArray(checked)) {
            const { checked: checkedValues } = checked;
            console.log(checkedValues);
        }
    };
    // 表单提交处理
    const submitHandle = async () => {
        onClose();
    };
    return (
        <Modal
            open
            title="分配资源"
            okText="提交"
            cancelText="取消"
            onCancel={() => onClose()}
            onOk={submitHandle}
        >
            <Card>
                <Row>
                    <Form form={form} onFinish={() => message.success('还没做')}>
                        <Space>
                            <Form.Item name="name">
                                <Input placeholder="搜索" allowClear />
                            </Form.Item>
                            <Form.Item name="search">
                                <Button icon={<SearchOutlined />} htmlType="submit" />
                            </Form.Item>
                        </Space>
                    </Form>
                </Row>
                <Row>
                    {listMenuTree && (
                        <Tree
                            checkable
                            checkStrictly
                            // 默认展开所有树节点
                            defaultExpandAll
                            // 点击复选框触发
                            onCheck={onCheck}
                            treeData={listMenuTree as DataNode[]}
                            fieldNames={{ title: 'label', key: 'id' }}
                        />
                    )}
                </Row>
            </Card>
        </Modal>
    );
};
