const ispro = process.env.NODE_ENV !== 'development'
module.exports = {
  publicPath: ispro ? '' : '/',
  outputDir: 'easyWorkHelper',
  assetsDir: 'static',
  lintOnSave: false
}
