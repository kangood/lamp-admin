import { FC, ReactNode, useEffect, useRef, useState } from 'react';

import { isNil } from 'lodash';

import { config } from '@/config';

import { FetcherStore } from '../fetcher/store';

import { AuthContext } from './constants';

const Auth: FC<{ children?: ReactNode }> = ({ children }) => {
    const token = FetcherStore((state) => state.token);
    // const fetcher = useFetcher();
    // const [auth, setAuth] = useState<IAuth | null>(null);
    const [auth, setAuth] = useState<any>(null);
    const { api, error } = config().auth ?? {};
    const requested = useRef(false);
    useEffect(() => {
        const getInfo = async () => {
            if (isNil(token) || isNil(api)) {
                setAuth(null);
            } else {
                try {
                    // const { data } = await fetcher.get(api);
                    setAuth({
                        code: 0,
                        result: null,
                        message: 'user info fetch success',
                        type: 'success',
                    });
                } catch (err) {
                    setAuth(null);
                    !isNil(error) ? error() : console.log(err);
                }
            }
        };
        if (requested.current) getInfo();
        return () => {
            requested.current = true;
        };
    }, [token, api, error]);
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export default Auth;
