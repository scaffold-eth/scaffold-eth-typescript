module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  ignorePatterns: ['**/*.pcss', '**/*.css', '**/*.less'],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports,
    ecmaFeatures: {
      jsx: false, // Allows for the parsing of JSX,
    },
    project: './tsconfig.json',
    tsconfigRootDir: '.',
    projectFolderIgnoreList: [
      'node_modules/*',
      'node_modules',
      'dist',
      'build',
      '.yarn',
      'build-utils',
      'docs',
      './src/styles',
      './src/generated/*',
      'generated/*',
    ],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  plugins: ['prettier', 'react', 'react-hooks', 'unused-imports'],
  rules: {
    eqeqeq: ['error', 'smart'],
    'react/jsx-wrap-multilines': 'warn',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-indent': 'off',
    'react/require-default-props': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'off',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: '(useRecoilCallback)',
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'warn',
      {
        'ts-expect-error': false,
        'ts-ignore': true,
        'ts-nocheck': false,
        'ts-check': false,
      },
    ],
    '@typescript-eslint/no-empty-function': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports-ts': 'warn',
    'unused-imports/no-unused-vars-ts': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'react/destructuring-assignment': 'off',
    'no-param-reassign': 'error',
    'import/order': [
      'warn',
      {
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
        'newlines-between': 'always',
      },
    ],
    'no-duplicate-imports': 'warn',
    'import/named': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default-member': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unused-modules': ['off'],
    'import/no-unassigned-import': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-underscore-dangle': [
      'off',
      {
        allow: ['obj'],
        allowFunctionParams: false,
        allowAfterSuper: true,
        allowAfterThis: true,
        allowAfterThisConstructor: true,
        enforceInMethodNames: true,
      },
    ],
    'sort-keys': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['off'],
    'no-use-before-define': 'off',
    'spaced-comment': 'warn',
    'max-len': 'off',
    indent: 'off',
    'no-console': 'off',
    'arrow-body-style': 'off',
    'no-multiple-empty-lines': 'warn',
    'no-restricted-globals': 'off',
    'eslint linebreak-style': 'off',
    'object-curly-newline': 'off',
    'no-shadow': 'off',
    'no-void': ['error', { allowAsStatement: true }],
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16."off"`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
    },
  },
  reportUnusedDisableDirectives: true,
};
