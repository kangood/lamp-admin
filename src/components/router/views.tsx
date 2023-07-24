import pMinDelay from 'p-min-delay';
import { FC, lazy } from 'react';
import { timeout } from 'promise-timeout';
import { has } from 'lodash';
import { Navigate, useLocation } from 'react-router';

/**
 * 根据正则和glob递归获取所有动态页面导入映射
 * [key:bar/foo]: () => import('{起始目录: 如pages}/bar/foo.blade.tsx')
 * @param imports 需要遍历的路径规则,支持glob
 * @param reg 用于匹配出key的正则表达式
 */
const getAsyncImports = (imports: Record<string, () => Promise<any>>, reg: RegExp) => {
    return Object.keys(imports)
        .map((key) => {
            const names = reg.exec(key);
            return Array.isArray(names) && names.length >= 2
                ? { [names[1]]: imports[key] }
                : undefined;
        })
        .filter((m) => !!m)
        .reduce((o, n) => ({ ...o, ...n }), []) as unknown as Record<string, () => Promise<any>>;
};
/**
 * 所有动态页面映射
 */
export const pages = getAsyncImports(
    import.meta.glob('../../views/**/*.page.{tsx,jsx}'),
    /..\/\..\/views\/([\w+.?/?]+)(.page.tsx)|(.page.jsx)/i,
);

/**
 * 异步页面组件
 * @param props
 */
export const getAsyncImport = (props: { page: string }) => {
    const { page } = props;
    if (!has(pages, page)) throw new Error(`Page ${page} not exits in 'views' dir!`);
    return lazy(() => timeout(pMinDelay(pages[page](), 5), 3000));
};

/**
 * 未登录跳转页面组件
 * @param props
 */
export const AuthRedirect: FC<{
    /** 登录跳转地址 */
    loginPath?: string;
}> = ({ loginPath }) => {
    const location = useLocation();
    let redirect = `?redirect=${location.pathname}`;
    if (location.search) redirect = `${redirect}${location.search}`;
    return <Navigate to={`${loginPath}${redirect}`} replace />;
};
