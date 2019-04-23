/**
 * Configures babel with the required presets and plugins.
 *
 * @see https://babeljs.io/docs/en/configuration
 *
 * @param api
 * @returns {{presets: Array, plugins: Array}}
 */
module.exports = api => {
    api.cache(true);

    const presets = [
        [require('@babel/preset-env'), {
            targets: {
                node: 'current',
                browsers: ['last 2 versions', 'IE 11'],
            },
            useBuiltIns: 'usage',
            corejs: {
                version: 3,
                proposals: true,
            },
        }],
    ];

    const plugins = [
        [require('@babel/plugin-proposal-class-properties'), {
            loose: true,
        }],
        [require('@babel/plugin-transform-runtime'), {
            regenerator: true,
        }],
    ];

    return {
        presets,
        plugins,
    };
};
