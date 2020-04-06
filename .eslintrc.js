module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'airbnb-base',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    use: true
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'strict': [0, 'global'],
    'consistent-return': 'off',
    'no-param-reasssign': 'off',
    'camelcase': 'off',
    'no-unused-vars': ['error', { 'argsIgnorePattern': 'next' }]
  },
};
