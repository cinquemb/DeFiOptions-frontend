module.exports = {
  presets: [
    ['@babel/preset-react'],
    ['@babel/preset-env'],
    ['@vue/cli-plugin-babel/preset', {'jsx': false}],
  ],
  plugins: [
    ['transform-react-jsx'],
    ['@babel/plugin-syntax-dynamic-import'],
  ]
}
