import { CSSProperties, FC } from 'react';

export const Logo: FC<{ style?: CSSProperties }> = ({ style }) => {
    return (
        <div
            className="tw-h-[36px] tw-m-[16px] tw-bg-[rgb(255 255 255 / 20%)]"
            style={style ?? {}}
        />
    );
};
