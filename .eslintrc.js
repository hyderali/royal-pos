module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],
  env: {
    browser: true
  },
  globals: {
    document: false,
    window: false,
    '-Promise': false,
    $: false
  },
  rules: {
  }
};