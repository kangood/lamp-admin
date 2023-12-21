import { Descriptions, DescriptionsProps, Modal, Radio } from 'antd';

import { DictMapListType } from '@/views/setting/dictionaries/constants';

import { OutputType } from './constants';

interface OsscDetailPageProps {
    clickOne?: OutputType;
    dictListTypes: DictMapListType;
    onClose: () => void;
}

export const OsscDetailPage: React.FC<OsscDetailPageProps> = ({
    clickOne,
    dictListTypes,
    onClose,
}) => {
    const items: DescriptionsProps['items'] = [
        {
            key: 'category',
            label: '种类',
            children: (
                <Radio.Group buttonStyle="solid" value={clickOne?.category?.toString()}>
                    {dictListTypes &&
                        dictListTypes?.OSSC_CATEGORY.map((item) => (
                            <Radio disabled key={item.id?.toString()} value={item.code}>
                                {item.name}
                            </Radio>
                        ))}
                </Radio.Group>
            ),
        },
        {
            key: 'code',
            label: '资源编码',
            children: clickOne?.code,
        },
        {
            key: 'endpoint',
            label: '资源地址',
            children: clickOne?.endpoint,
        },
        {
            key: 'bucketName',
            label: '空间名',
            children: clickOne?.bucketName,
        },
        {
            key: 'accessKey',
            label: 'accessKey',
            children: clickOne?.accessKey,
        },
        {
            key: 'secretKey',
            label: 'secretKey',
            children: clickOne?.secretKey,
        },
        {
            key: 'describe',
            label: '描述',
            children: clickOne?.describe,
        },
        {
            key: 'createdAt',
            label: '创建时间',
            children: clickOne?.createdAt?.toString(),
        },
        {
            key: 'updatedAt',
            label: '修改时间',
            children: clickOne?.updatedAt?.toString(),
        },
    ];
    return (
        <Modal width={820} onCancel={() => onClose()} open footer={null}>
            <Descriptions title="用户详情" bordered column={1} layout="horizontal" items={items} />
        </Modal>
    );
};
