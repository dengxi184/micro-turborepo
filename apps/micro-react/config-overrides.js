module.exports = {
  deServer: () => {
    config.headers = {
      'Access-Control-Allow-Origin': '*',
    };
    return config;
  },
};
