import { createContext } from 'react';

import { IAuth } from './type';

export const AuthContext = createContext<IAuth | null>(null);
