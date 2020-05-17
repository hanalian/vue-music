const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  publicPath: "./",
  outputDir: "dist",
  lintOnSave: true,
  assetsDir: "static",
  pages: undefined,
  runtimeCompiler: false,
  productionSourceMap: false,
  configureWebpack: config => {
    require("vux-loader").merge(config, {
      options: {},
      plugins: ["vux-ui"]
    });
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css/,
            threshold: 10240,
            deleteOriginalAssets: false
          })
        ]
      };
    }
  },
  devServer: {
    host: "0.0.0.0",
    port: "8080",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
