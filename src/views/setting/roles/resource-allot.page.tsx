import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Modal, Row, Space, Tree, message } from 'antd';

import { DataNode } from 'antd/es/tree';

import { useState } from 'react';

import { isEmpty } from 'lodash';

import { RESOURCE_TYPE_DATA, RESOURCE_TYPE_MENU } from '@/utils/constants';

import { useSaveBatchRoleAutority } from '@/services/role-authority';

import { OutputType } from '../menus/list.page';

interface ResourceAllotPageProps {
    clickRoleId: number;
    clickListRoleAuthorityId: number[];
    listMenuTreeInitData: OutputType[];
    listMenuTreeVariable: OutputType[];
    onClose: () => void;
}

export interface InputType {
    menuIdList?: number[];
    resourceIdList?: number[];
    roleId: number;
}

/**
 * 递归遍历数结构，并处理节点标签值
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

// /**
//  * 递归遍历数结构，并处理节点标签值
//  */
// const traverseTreeOnSearch = (node: OutputType, value: string, searchNodeList: OutputType[]) => {
//     // 处理节点的标签值
//     if (node.label?.includes(value)) {
//         searchNodeList.push(node);
//     }
//     // 递归处理子节点
//     node.children = node.children?.map((childNode) =>
//         traverseTreeOnSearch(childNode, value, searchNodeList),
//     );
//     return node;
// };

// /**
//  * 递归遍历数结构，并处理节点标签值，只push节点ID
//  */
// const traverseTreeOnSearchToId = (node: OutputType, value: string, searchNodeList: number[]) => {
//     // 处理节点的标签值
//     if (node.label?.includes(value)) {
//         searchNodeList.push(node.id!);
//     }
//     // 递归处理子节点
//     node.children = node.children?.map((childNode) =>
//         traverseTreeOnSearchToId(childNode, value, searchNodeList),
//     );
//     return node;
// };

// /**
//  * 递归删除不要的数据
//  */
// const removeNodesByIds = (tree: OutputType[], idsToRemove: number[]): OutputType[] => {
//     return tree.filter((node) => {
//         if (idsToRemove.includes(node.id!)) {
//             return true; // 如果当前节点的 ID 在要删除的列表中，不包含该节点
//         }

//         if (node.children) {
//             node.children = removeNodesByIds(node.children, idsToRemove);
//         }

//         return false; // 保留当前节点
//     });
// };

export const ResourceAllotPage: React.FC<ResourceAllotPageProps> = ({
    clickRoleId,
    clickListRoleAuthorityId,
    listMenuTreeInitData,
    onClose,
}) => {
    const [treeData] = useState<OutputType[]>(listMenuTreeInitData);
    const { mutateAsync } = useSaveBatchRoleAutority();
    const [checkedNodes, setCheckedNodes] = useState<InputType>();
    // console.log('123', listMenuTreeInitData, listMenuTreeVariable);
    // setTimeout(() => {
    //     setTreeData(listMenuTreeInitData);
    // }, 10);
    // 复选框点击时处理
    const onCheck = (_checked: React.Key[] | { checked: React.Key[] }, info: any) => {
        if (!isEmpty(info.checkedNodes)) {
            const menuIdList = info.checkedNodes
                .filter((item: OutputType) => item.resourceType === RESOURCE_TYPE_MENU)
                .map((item: OutputType) => item.id);
            const resourceIdList = info.checkedNodes
                .filter((item: OutputType) => item.resourceType === RESOURCE_TYPE_DATA)
                .map((item: OutputType) => item.id);
            setCheckedNodes({ roleId: clickRoleId, menuIdList, resourceIdList });
            console.log('123', menuIdList, resourceIdList);
        } else {
            setCheckedNodes(undefined);
        }
    };
    // 表单提交处理
    const submitHandle = async () => {
        if (checkedNodes) {
            mutateAsync(checkedNodes);
        }
        onClose();
    };
    // ==========搜索处理==========
    // 变化回调
    const onChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
        message.error('暂时不做了');
        // // 搜索字
        // const { value } = e.target;
        // if (value === '') {
        //     // set一次之后就会被跟着更新数据
        //     // setTreeData(listMenuTreeInitData);
        //     return;
        // }
        // // 1、递归所有节点，查询搜索字对应的节点
        // // const searchNodeList: OutputType[] = [];
        // const searchNodeList: number[] = [];
        // console.log('你变了？', treeData);
        // listMenuTreeInitData?.forEach((rootNode) => {
        //     traverseTreeOnSearchToId(rootNode, value, searchNodeList);
        // });
        // console.log('searchNodeList', searchNodeList);
        // // 2、计算需要保留的节点id
        // // 3、递归删除不用显示的节点
        // const prunedTree = removeNodesByIds(listMenuTreeVariable, searchNodeList);
        // console.log('prunedTree', prunedTree);
        // setTreeData(prunedTree);
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
                    <Form onFinish={() => message.success('还没做')}>
                        <Space>
                            <Form.Item name="name">
                                <Input placeholder="搜索" allowClear onChange={onChange} />
                            </Form.Item>
                            <Form.Item name="search">
                                <Button icon={<SearchOutlined />} htmlType="submit" />
                            </Form.Item>
                        </Space>
                    </Form>
                </Row>
                <Row>
                    <Tree
                        // 开启复选框
                        checkable
                        // 父子节点选中状态不再关联
                        checkStrictly
                        // 默认展开所有树节点
                        defaultExpandAll
                        // 默认选中复选框的树节点
                        defaultCheckedKeys={clickListRoleAuthorityId}
                        // 点击复选框触发
                        onCheck={onCheck}
                        // 异步加载数据
                        // loadData={onLoadData}
                        // 展开/收起时触发
                        // onExpand={onExpand}
                        // 是否自动展开父节点
                        // autoExpandParent
                        treeData={treeData as DataNode[]}
                        fieldNames={{ title: 'label', key: 'id' }}
                    />
                </Row>
            </Card>
        </Modal>
    );
};
