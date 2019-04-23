const { join } = require('path');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const common = require('../common');

module.exports = merge(common, {
    name: 'client',
    target: 'web',
    entry: join(__dirname, '../../src/client/index'),
    output: {
        filename: 'app.client.js',
        chunkFilename: '[name].chunk.js',
    },
    plugins: [
        new VueSSRClientPlugin(),
    ],
});
