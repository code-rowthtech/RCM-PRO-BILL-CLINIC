const webpack = require('webpack');

module.exports = function override(config) {
  // Polyfills for Node.js core modules in the browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    constants: require.resolve('constants-browserify'),
    process: require.resolve('process/browser.js'), // Explicitly include the `.js`
  };

  // Provide polyfilled globals
  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js', // Provide with the `.js` explicitly
    }),
  ];

  // Fix process alias with `.js`
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    process: 'process/browser.js', // Explicitly include `.js`
  };

  return config;
};
