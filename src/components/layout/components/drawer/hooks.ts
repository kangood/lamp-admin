import { createContext, useContext } from 'react';

export const DrawerContext = createContext<boolean>(false);
export const ChangeDrawerContext = createContext<(show: boolean) => void>((_show: boolean) => {});
export const useDrawer = () => useContext(DrawerContext);
export const useDrawerChange = () => useContext(ChangeDrawerContext);
