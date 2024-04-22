import typescript from "@rollup/plugin-typescript";

export default {
    input: './src/index.ts',
    output: [
        //cjs  esm
        {
            format: 'cjs',
            file: 'lib/guide-mini-vue.cjs.js',
        },
        {
            format: 'esm',
            file: 'lib/guide-mini-vue.esm.js',
        }

    ],
    plugins: [typescript()]
}