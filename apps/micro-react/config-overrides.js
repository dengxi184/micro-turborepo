const {
  override,
  overrideDevServer,
  addLessLoader,
  adjustStyleLoaders,
} = require('customize-cra');
const devServerConfig = () => (config) => {
  config.headers = {
    'Access-Control-Allow-Origin': '*',
  };
  return config;
};

module.exports = {
  webpack: override(
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#030852', // primary color for all components
        },
      },
    }),
    adjustStyleLoaders(({ use: [, , postcss] }) => {
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
  ),
  devServer: overrideDevServer(devServerConfig()),
};
