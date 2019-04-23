const { join } = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    output: {
        path: join(__dirname, '../public/assets'),
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@': join(__dirname, '../src/shared'),
            'vue$': 'vue/dist/vue.esm.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        compilerOptions: {
                            preserveWhitespace: false,
                        },
                    },
                },
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
};
