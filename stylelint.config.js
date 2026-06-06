const config = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recess-order',
    'stylelint-config-standard-vue/scss',
  ],
  rules: {
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'scss/no-global-function-names': null,
    'scss/comment-no-empty': null,
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
  },
};

export default config;
