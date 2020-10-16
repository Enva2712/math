import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    plugins: [
        typescript({ module: 'commonjs' }),
        commonjs({ extensions: ['.js', '.ts'] }),
    ],
    external: ['fraction.js', 'tslib'],
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
