import { PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { viteMockServe } from 'vite-plugin-mock';

export function createPlugins() {
    const vitePlugins: (PluginOption | PluginOption[])[] = [
        react(),
        Icons({ compiler: 'jsx', jsx: 'react' }),
        viteMockServe({
            ignore: /^_/,
            mockPath: 'mock',
            localEnabled: true,
            prodEnabled: false,
        }),
    ];
    return vitePlugins;
}
