import useFetch from '@/hooks/useFetch';

/**
 * 查询参数带分页
 */
export const useParameters = () => {
    const { data, loading, error } = useFetch('/param', undefined);
    if (loading) return 'Loading...';
    if (error) return 'Oops!';
    return {
        data: data?.items,
        meta: data?.meta,
        loading,
        error,
    };
};
