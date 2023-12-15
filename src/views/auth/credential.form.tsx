import { FC, useCallback, useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { isNil } from 'lodash';

import { ProForm, ProFormText } from '@ant-design/pro-components';

import { App } from 'antd';

import { useRouterStore } from '@/components/router/hooks';
import { useAuth } from '@/components/auth/hooks';
import { FetcherStore } from '@/components/fetcher/store';
import { service } from '@/http/axios/service';

const CredentialForm: FC = () => {
    const { message } = App.useApp();
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
            // 设置默认跳转路径为home
            navigate(redirect === '/' ? '/home' : redirect, { replace: true });
        }
    }, [routerReady, auth]);
    return (
        <div className="p-4 w-full">
            <ProForm
                className="enter-x"
                onFinish={async (values) => {
                    try {
                        const {
                            data: {
                                code,
                                message: resMsg,
                                result: { accessToken, refreshToken },
                            },
                        } = await service.post('/auth/login', values);
                        if (code === 200 && !isNil(accessToken)) {
                            // 3R框架原有token的存储位置是FetcherStore.setState，用于验证登录并跳转，refresh_token加在localStorage中
                            FetcherStore.setState((state) => {
                                state.token = accessToken;
                                localStorage.setItem('refresh_token', refreshToken);
                            });
                            message.success(resMsg);
                        } else {
                            message.error(resMsg);
                        }
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
                    name="account"
                    placeholder="请输入账号"
                    rules={[
                        {
                            required: true,
                            message: '请输入账号!',
                        },
                    ]}
                />
                <ProFormText.Password
                    fieldProps={{
                        size: 'large',
                    }}
                    name="password"
                    placeholder="请输入密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码!',
                        },
                    ]}
                />
            </ProForm>
        </div>
    );
};
export default CredentialForm;
