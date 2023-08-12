import { Button, Card, Col, Divider, Form, Input, Pagination, Row, Table } from 'antd';

import { useState } from 'react';

import { useDelDicts, useListType, useListSingleType } from '@/services/dictionary';

import { listTypeColumns, listColumns, OutputType, InputType } from './constants';
import { DictionaryRightEditForm } from './edit.page';

export default () => {
    const [form] = Form.useForm();
    // 状态定义
    const [clickType, setClickType] = useState<string>('0');
    const [code, setCode] = useState<string>();
    const [name, setName] = useState<string>();
    const [pageQ, setPageQ] = useState<number>(1);
    const [limitQ, setLimitQ] = useState<number>(10);
    const [listTitle, setListTitle] = useState<string>('');
    // API-hooks
    const { mutateAsync: delMutate, isLoading: delLoading } = useDelDicts();
    const { data: listTypeData, isLoading: listTypeLoading } = useListType();
    const { listSingleTypeData, listSingleTypeLoading, listSingleTypeRefetch } = useListSingleType(
        clickType,
        pageQ,
        limitQ,
        code,
        name,
    );
    // ==========左边栏处理==========
    // ......
    // ==========右边栏处理==========
    // 字典详情分页改变处理
    const onListPageChange = (page: number, pageSize: number) => {
        setPageQ(page);
        setLimitQ(pageSize);
    };
    // 打开编辑表单处理器，点击按钮触发
    const [clickDict, setClickDict] = useState<OutputType>();
    const [showInfo, setShowInfo] = useState(false);
    const onOpenFormHandler = (record?: OutputType) => {
        if (record) {
            setClickDict(record);
        } else {
            const defaultRecord = { type: clickType, label: listTitle, state: true };
            setClickDict(defaultRecord);
        }
        setShowInfo(true);
    };
    // 关闭模态窗口并刷新数据
    const closeAndRefetchHandler = (isReload?: boolean) => {
        setShowInfo(false);
        if (isReload) {
            // 整理刷新总是返回的上一次数据，why？
            listSingleTypeRefetch();
            // const qResult: Promise<QueryObserverResult<ResultType<OutputType>>> = refetch();
            // qResult.then((res) => {
            //     const xx = res.data?.items.filter((item) => item.id === clickDict?.id);
            //     console.log(xx?.[0]);
            //     setClickDict(xx?.[0]);
            // });
        }
    };
    // 删除处理器，点击删除按钮触发API调用
    const onDelHandler = (ids: number[]) => {
        delMutate(ids);
        listSingleTypeRefetch();
    };
    // 表单提交处理
    const onFinishHandler = (values: InputType) => {
        setCode(values.code);
        setName(values.name);
        listSingleTypeRefetch();
    };
    // 重置表单处理
    const resetHandler = () => {
        form.resetFields();
        setCode('');
        setName('');
        listSingleTypeRefetch();
    };
    return (
        <div>
            <Row>
                <Col>
                    <Card title="字典列表" style={{ width: 450 }}>
                        <Table
                            bordered
                            loading={listTypeLoading}
                            columns={listTypeColumns({ onOpenFormHandler, onDelHandler })}
                            dataSource={listTypeData?.items}
                            pagination={false}
                            // record的类型为Antd中的InputType，找不到所以抽取不了，就写在这里了
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        setClickType(record.type);
                                        setListTitle(record.label);
                                    },
                                };
                            }}
                        />
                        <Divider />
                        <Pagination
                            showSizeChanger
                            // onChange={onPageChange}
                            total={listTypeData?.meta?.totalItems}
                            current={listTypeData?.meta?.currentPage}
                            showTotal={(total) => `共 ${total} 条`}
                        />
                    </Card>
                </Col>
                <Col>
                    <Card title={`[${listTitle || ''}]字典详情`} style={{ width: 800 }}>
                        <Form form={form} onFinish={onFinishHandler}>
                            <Row gutter={24}>
                                <Col span={6}>
                                    <Form.Item name="code">
                                        <Input placeholder="编码" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="name">
                                        <Input placeholder="名称" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            搜索
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Button type="primary" onClick={resetHandler}>
                                        重置
                                    </Button>
                                </Col>
                                <Col span={3}>
                                    <Button type="primary" onClick={() => onOpenFormHandler()}>
                                        添加
                                    </Button>
                                </Col>
                                <Col span={3}>
                                    <Button type="primary">删除</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            bordered
                            loading={delLoading || listSingleTypeLoading}
                            columns={listColumns({ onOpenFormHandler, onDelHandler })}
                            dataSource={listSingleTypeData?.items}
                            pagination={false}
                        />
                        {listSingleTypeData?.meta?.totalItems !== 0 && (
                            <div>
                                <Divider />
                                <Pagination
                                    showSizeChanger
                                    onChange={onListPageChange}
                                    showTotal={(total) => `共 ${total} 条`}
                                    total={listSingleTypeData?.meta?.totalItems}
                                    current={listSingleTypeData?.meta?.currentPage}
                                />
                            </div>
                        )}
                        {/* 弹出层表单 */}
                        {showInfo && (
                            <DictionaryRightEditForm
                                clickDict={clickDict}
                                onClose={closeAndRefetchHandler}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
