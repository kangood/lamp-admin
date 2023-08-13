import { message } from 'antd';
import { AxiosError } from 'axios';

import { ResponseResultType } from './types';

export const globalSuccess = () => message.success('success', 1);
// export const globalError = (error: AxiosError) => message.error(error.message);
export const globalError = (error: AxiosError<ResponseResultType>) =>
    message.error(error.response?.data.message ?? error.message);
