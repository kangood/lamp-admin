import axios, { AxiosInstance } from 'axios';
import { createContext } from 'react';

export const FetcherContext = createContext<AxiosInstance>(axios.create());
