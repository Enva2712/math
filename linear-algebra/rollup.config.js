import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    plugins: [
        typescript({ module: 'commonjs' }),
        nodeResolve(),
        commonjs({ extensions: ['.js', '.ts'] }),
    ],
    external: ['tslib'],
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        {
            file: 'dist/index.es.js',
            format: 'esm',
            exports: 'named',
            sourcemap: true,
        },
    ],
}
