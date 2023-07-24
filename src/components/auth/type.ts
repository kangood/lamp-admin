export interface IAuth extends Record<string, any> {
    username: string;
    permissions: string[];
}
export interface AuthConfig {
    api: string;
    error?: () => void;
}
