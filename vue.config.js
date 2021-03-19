const { VUE_APP_URL } = process.env
const { VUE_APP_WEBURL } = process.env
const path = require('path')
const loginData = require('./mork/login.json')
function resolve(dir) {
  return path.join(__dirname, './', dir)
}
module.exports = {
  publicPath: './',
  outputDir: 'clientDist',
  productionSourceMap: false,
  assetsDir: 'static',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/css/common.scss";
        `
      },
      less: {
        lessOptions: {
          javascriptEnabled: true,
        }
      },
    }
  },
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
    // 生产环境配置
    if (process.env.NODE_ENV === 'production') {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
    }
  },
  devServer: {
    port: 8889, // 端口号
    host: '0.0.0.0',
    hot: true,
    // watchContentBase: true,
    // liveReload: true,
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    proxy: {
      '/ytapi': {
        // 目标 API 地址
        target: VUE_APP_URL,
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          '^/ytapi': ''
        }
      },
      '/webapi': {
        // 目标 API 地址
        target: VUE_APP_WEBURL,
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          '^/webapi': ''
        }
      }
    },
    // 模拟数据
    before(app) {
      app.get('/api/login', (req, res) => {
        res.json(loginData)
      })
    }
  },
  configureWebpack: config => {
    // config.optimization.minimizer[0].options.terserOptions.compress['drop_console'] = process.env.NODE_ENV === 'production'
    // 将每个依赖包打包成单独的js文件
    let optimization = {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    }
    let performance = {
      hints: 'warning',
      //入口起点的最大体积
      maxEntrypointSize: 50000000,
      //生成文件的最大体积
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
    config.performance = performance
    Object.assign(config.optimization, optimization)
    config.optimization.minimizer[0].options.terserOptions.compress['drop_console'] = process.env.NODE_ENV === 'production'
  },
  // 第三方插件配置
  pluginOptions: {}
}
