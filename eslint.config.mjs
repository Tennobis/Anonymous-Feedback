import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier', // ✅ This disables ESLint rules that conflict with Prettier
  ),
  {
    files: ['**/*'],
    rules: Object.fromEntries(
      Object.keys((await import('eslint/conf/eslint-all')).default.rules).map(rule => [
        rule,
        'off',
      ]),
    ),
  },
];

export default eslintConfig;
