import { IAuth } from '@/components/auth/type';

import type { MockItem } from './types';

import type { RequestParams } from './_util';
import { resultError, getRequestToken } from './_util';

export function createFakeUserList(): IAuth[] {
    return [
        {
            id: '1',
            username: 'pincman',
            email: 'pincman@qq.com',
            nickname: 'pincman',
            avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
            desc: 'manager',
            password: '123456',
            token: 'fakeToken1',
            homePath: '/dashboard/analysis',
            permissions: [],
        },
        {
            id: '2',
            username: 'test',
            email: 'pincman@qq.com',
            password: '123456',
            nickname: 'test user',
            avatar: 'https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640',
            desc: 'tester',
            token: 'fakeToken2',
            homePath: '/dashboard/workbench',
            permissions: [],
        },
    ];
}
export default [
    // mock user login
    {
        url: '/api/user/auth/login',
        timeout: 200,
        method: 'post',
        response({ body }: { body: any }) {
            const { credential, password } = body;
            const checkUser = createFakeUserList().find(
                (item) =>
                    (item.username === credential || item.nickname === credential) &&
                    password === item.password,
            );
            if (!checkUser) {
                this.res.statusCode = 401;
                return resultError('Incorrect account or password');
            }
            const { token } = checkUser;
            return { token };
        },
    },
    {
        url: '/api/user/info',
        method: 'get',
        response: (request: RequestParams) => {
            const token = getRequestToken(request);
            if (!token) return resultError('Invalid token');
            const checkUser = createFakeUserList().find((item) => item.token === token);
            if (!checkUser) {
                return resultError('The corresponding user information was not obtained!');
            }
            return checkUser;
        },
    },
] as MockItem[];
