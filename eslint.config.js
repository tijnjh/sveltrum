import antfu from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  rules: {
    'antfu/no-top-level-await': 'off',
    'style/quote-props': 'off',
  },
})
