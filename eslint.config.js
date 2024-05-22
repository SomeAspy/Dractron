// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticJs from "@stylistic/eslint-plugin-js";

export default tseslint.config(

    eslint.configs.recommended,
    {ignores:["dist/"]},
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        plugins: {
            "@stylistic/js":stylisticJs
        },
    
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules:{
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/restrict-template-expressions": "warn",
            "@typescript-eslint/prefer-for-of": "off",
            "@typescript-eslint/no-misused-promises": "off",
            '@stylistic/js/semi': "error",
            '@stylistic/js/indent': "error",

        }
    },
);