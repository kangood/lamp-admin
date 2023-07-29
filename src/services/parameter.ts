import useFetch from '@/hooks/useFetch';

/**
 * 查询参数带分页
 */
export const useParameters = () => {
    const { data, loading, error } = useFetch('/param', {});
    if (loading) return 'Loading...';
    if (error) return 'Oops!';
    return {
        data,
        // meta: data?.meta,
        loading,
        error,
    };
};
