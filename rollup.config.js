import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default {
    input: "src/index.ts",
    plugins: [typescript(), terser()],
    external: ["fraction.js", "tslib"],
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "esm",
            exports: "named",
            sourcemap: true,
        },
    ],
};
