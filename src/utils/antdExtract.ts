import { message } from 'antd';
import { AxiosError } from 'axios';

export const globalSuccess = () => message.success('success', 1);
export const globalError = (error: AxiosError) => message.error(error.message);
