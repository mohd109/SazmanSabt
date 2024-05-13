/* config-overrides.js */
const webpack = require('webpack');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        util: require.resolve('util/'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        os: require.resolve("os-browserify/browser") ,
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        'process/browser':require.resolve('process/browser')
    };

    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],

        }),
    );

    return config;
}
