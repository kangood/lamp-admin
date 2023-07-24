import { FC, useCallback, useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { isNil } from 'lodash';

import { ProForm, ProFormText } from '@ant-design/pro-components';

import { App } from 'antd';

import { useFetcher } from '@/components/fetcher/hooks';
import { useRouterStore } from '@/components/router/hooks';
import { useAuth } from '@/components/auth/hooks';
import { FetcherStore } from '@/components/fetcher/store';

const CredentialForm: FC = () => {
    const { message } = App.useApp();
    const fetcher = useFetcher();
    const basePath = useRouterStore((state) => state.config.basename)!;
    const routerReady = useRouterStore((state) => state.ready);
    const auth = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const getRedirect = useCallback(() => {
        let queryRedirect = searchParams.get('redirect');
        if (queryRedirect && queryRedirect.length > 0) {
            searchParams.forEach((v, k) => {
                if (k !== 'redirect') queryRedirect = `${queryRedirect}&${k}=${v}`;
            });
            return queryRedirect;
        }
        return basePath;
    }, [searchParams]);
    useEffect(() => {
        const redirect = getRedirect();
        if (routerReady && !isNil(auth)) {
            navigate(redirect, { replace: true });
        }
    }, [routerReady, auth]);
    return (
        <div className="tw-p-4 tw-w-full">
            <ProForm
                className="tw-enter-x"
                onFinish={async (values) => {
                    try {
                        const {
                            data: { token },
                        } = await fetcher.post('/user/auth/login', values);
                        if (!isNil(token)) {
                            FetcherStore.setState((state) => {
                                state.token = token;
                            });
                        }
                        message.success('登录成功');
                        // waitTime();
                    } catch (err) {
                        message.error('用户名或密码错误');
                    }
                }}
                submitter={{
                    searchConfig: {
                        submitText: '登录',
                    },
                    render: (_, dom) => dom.pop(),
                    submitButtonProps: {
                        size: 'large',
                        style: {
                            width: '100%',
                        },
                    },
                }}
            >
                <ProFormText
                    fieldProps={{
                        size: 'large',
                        // prefix: <MobileOutlined />,
                    }}
                    name="credential"
                    placeholder="请输入用户名,手机号或邮箱地址"
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号!',
                        },
                        {
                            message: '不合法的手机号格式!',
                        },
                    ]}
                />
                <ProFormText.Password
                    fieldProps={{
                        size: 'large',
                    }}
                    name="password"
                    placeholder="请输入密码"
                />
            </ProForm>
        </div>
    );
};
export default CredentialForm;
