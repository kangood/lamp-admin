import clsx from 'clsx';

import type { LoadingProps } from './types';

export const Loading: FC<LoadingProps> = ({ className, style, component }) => {
    // 'fixed w-full h-full top-0 left-0 dark:bg-white bg-gray-800 bg-opacity-25 flex items-center justify-center';
    const defaultClassName = clsx([
        'tw-h-full',
        'tw-w-full',
        'tw-flex',
        'tw-items-center',
        'tw-justify-center',
    ]);
    const classes = className ? `${defaultClassName} ${className}` : defaultClassName;
    return (
        <div className={classes} style={style ?? {}}>
            {component}
        </div>
    );
};
