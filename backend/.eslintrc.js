module.exports = {
  // Configuração base para todo o projeto
  env: {
    node: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    'class-methods-use-this': 'off',
  },

  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js'],
      extends: ['plugin:jest/recommended'],
      rules: {},
    },
  ],
};
