const { join } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const common = require('../common');

module.exports = merge(common, {
    name: 'server',
    target: 'node',
    externals: nodeExternals({
        whitelist: /\.css$/,
    }),
    entry: [
        join(__dirname, '../../src/server/index')
    ],
    output: {
        filename: 'app.server.js',
        libraryTarget: 'commonjs2',
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new VueSSRServerPlugin(),
    ],
});
