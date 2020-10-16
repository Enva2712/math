import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.ts',
    plugins: [
        typescript(),
        terser(),
    ],
    external: ['fraction.js', 'tslib'],
    output: [
        {
            file: 'dist/index.js',
            format: 'umd',
            name: 'envaMath',
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
