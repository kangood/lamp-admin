import type { FC } from 'react';

import clsx from 'clsx';

import bgimg from '@/assets/images/login-box-bg.svg';

import $styles from './login.module.css';
import CredentialForm from './credential.form';

const Login: FC = () => {
    return (
        <div className={$styles.container}>
            <span className="-enter-x xl:tw-hidden" />

            <div className={$styles.main}>
                <div className="tw-flex tw-h-full">
                    <div className={$styles.leftBlock}>
                        <div className="tw-my-auto">
                            <img alt="title" src={bgimg} className="tw-w-1/2 -tw-mt-16 -enter-x" />
                            <div className="tw-mt-10 tw-font-medium tw-text-white -tw-enter-x">
                                <span className="tw-mt-4 tw-text-3xl tw-inline-block">
                                    基于Vite+React的管理面板
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={clsx($styles.rightBlock, 'enter-x')}>
                        <div className={$styles.formBlock}>
                            <CredentialForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
