// const RouteLoading = () => {
//     return (
//         <Loading
//             className="tw-bg-white/80 dark:tw-bg-black/70 -tw-ml-2 -tw-mt-2 !tw-w-[calc(100%_+_theme(space.4))] !tw-h-[calc(100%_+_theme(space.4))] tw-transition-opacity tw-duration-300"
//             component={<Spinner name="Coffee" darkColor="rgb(252, 193, 105)" />}
//         />
//     );

import { RouteOption } from '@/components/router/types';

// };
export const addLoading = (routes: RouteOption[]): RouteOption[] => {
    return routes.map((item) => {
        const data = {
            ...item,
            // loading: RouteLoading,
        };
        if ('children' in data && data.children?.length)
            data.children = addLoading([...data.children]);
        return data;
    });
};
