declare type ArrayItem<A> = A extends readonly (infer T)[] ? T : never;
declare type ClassType<T> = { new (...args: any[]): T };
declare type ReRequired<T> = {
    [P in keyof T]-?: T[P] extends (infer U)[] | undefined
        ? ReRequired<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : ReRequired<T[P]>
        : T[P];
};
declare type FC<P extends RecordAnyOrNever = RecordNever> = React.FunctionComponent<P>;
declare module '@arco-design/color' {
    export function generate(color: string, option: any): string[];
    export function getRgbStr(value: string): string;
}
declare type RecordAny = Record<string, any>;
declare type RecordNever = Record<never, never>;
declare type RecordAnyOrNever = RecordAny | RecordNever;
declare type RecordScalable<T extends RecordAny, U extends RecordAnyOrNever> = T &
    (U extends Record<string, never> ? RecordNever : U);
declare type RePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] | undefined
        ? RePartial<U>[]
        : T[P] extends object | undefined
        ? T[P] extends ((...args: any[]) => any) | ClassType<T[P]> | undefined
            ? T[P]
            : RePartial<T[P]>
        : T[P];
};
