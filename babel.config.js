module.exports = {
  presets: [
    ['@babel/env', { targets: { node: '14' } }]
  ],
  env: {
    coverage: {
      plugins: ['istanbul']
    }
  },
  comments: false
}
