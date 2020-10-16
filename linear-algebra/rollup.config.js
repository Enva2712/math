import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    plugins: [
        typescript(),
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
