const vueConfig = {
  devServer: {
    port : 8184,
    proxy: {
      '^/api' : {
        target: 'http://localhost:8080',
        ws: false,
        changeOrigin: true,
        pathRewrite:{
          '^/api' : ''
        }
      }
    }
  }
}

module.exports = vueConfig