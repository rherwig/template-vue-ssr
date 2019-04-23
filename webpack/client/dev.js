const { join } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-eval-module-source-map',
    entry: [
        'webpack-hot-middleware/client',
        join(__dirname, '../../src/client/index'),
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
});
