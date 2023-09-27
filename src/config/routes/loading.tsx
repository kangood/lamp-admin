// const RouteLoading = () => {
//     return (
//         <Loading
//             className="bg-white/80 dark:bg-black/70 -ml-2 -mt-2 !w-[calc(100%_+_theme(space.4))] !h-[calc(100%_+_theme(space.4))] transition-opacity duration-300"
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
