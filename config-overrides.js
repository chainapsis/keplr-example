const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer/"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    process: require.resolve("process/browser"),
  })
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ])
  return config;
}
