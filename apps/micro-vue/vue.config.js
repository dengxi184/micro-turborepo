const path = require('path');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);

const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 打包分析
//const zlib = require('zlib')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/site/vue-demo/' : '/', // 公共路径 资源访问的路径前缀 注意线上环境和生产环境
  indexPath: 'index.html', // 相对于打包路径index.html的路径
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false, // 设置是否在开发环境下每次保存代码时都启用 eslint验证。
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map 映射报错代码的源代码段
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // 向 PWA 插件传递选项。
  chainWebpack: (config) => {
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin('html').tap((args) => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = 'none';
      return args;
    });
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'));
    // 压缩图片
    // 需要 npm i -D image-webpack-loader
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: false },
        pngquant: { quality: [0.65, 0.9], speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 },
      });
    // 打包分析
    // 打包之后自动生成一个名叫report.html文件(可忽视)
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static',
        },
      ]);
    }
  },
  configureWebpack: (config) => {
    // 开启 gzip 压缩
    // 需要 npm i -D compression-webpack-plugin
    const plugins = [];
    if (IS_PROD) {
      plugins.push(
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        }),
        // 压缩成 .br 文件，如果 zlib 报错无法解决，可以注释这段使用代码，一般本地没问题，需要注意线上服务器会可能发生找不到 zlib 的情况。
        // new CompressionPlugin({
        //   filename: '[path][base].br',
        //   algorithm: 'brotliCompress',
        //   test: productionGzipExtensions,
        //   compressionOptions: {
        //     params: {
        //       [zlib.constants.BROTLI_PARAM_QUALITY]: 11
        //     }
        //   },
        //   threshold: 10240,
        //   minRatio: 0.8
        // })
      );
    }
    config.plugins = [...config.plugins, ...plugins];
  },
  css: {
    extract: IS_PROD,
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // `globalVars` 定义全局对象，可加入全局变量
        globalVars: {
          primary: '#333',
        },
      },
    },
  },

  devServer: {
    port: 3002,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
