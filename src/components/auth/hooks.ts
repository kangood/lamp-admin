import { useContext } from 'react';

import { AuthContext } from './constants';

export const useAuth = () => useContext(AuthContext);
