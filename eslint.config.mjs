
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);

// module.exports = {
//     extends: 'erb',
//     plugins: ['@typescript-eslint'],
//     rules: {
//         // A temporary hack related to IDE not resolving correct package.json
//         'import/no-extraneous-dependencies': 'off',
//         'react/react-in-jsx-scope': 'off',
//         'react/jsx-filename-extension': 'off',
//         'import/extensions': 'off',
//         'import/no-unresolved': 'off',
//         'import/no-import-module-exports': 'off',
//         'no-shadow': 'off',
//         '@typescript-eslint/no-shadow': 'error',
//         'no-unused-vars': 'off',
//         '@typescript-eslint/no-unused-vars': 'warn',
//         'no-plusplus': 'off',
//         'class-methods-use-this': 'off',
//         'no-console': 'off',
//         'import/prefer-default-export': 'off',
//         'react/static-property-placement': 'off',
//         'no-continue': 'off',
//         'no-bitwise': 'off',
//         camelcase: 'off',
//         'no-underscore-dangle': 'off',
//         'react/destructuring-assignment': 'off',
//     },
//     parserOptions: {
//         ecmaVersion: 2022,
//         sourceType: 'module',
//     },
//     settings: {
//         'import/resolver': {
//             // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
//             node: {},
//             webpack: {
//                 config: require.resolve(
//                     './.erb/configs/webpack.config.eslint.ts',
//                 ),
//             },
//             typescript: {},
//         },
//         'import/parsers': {
//             '@typescript-eslint/parser': ['.ts', '.tsx'],
//         },
//     },
// };
