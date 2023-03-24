const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://43.136.20.18:9000'
    : 'http://localhost:9000';

module.exports = baseURL;
