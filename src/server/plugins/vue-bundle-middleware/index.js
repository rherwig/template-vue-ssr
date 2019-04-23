import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import MemoryFs from 'memory-fs';
import chokidar from 'chokidar';
import { createBundleRenderer } from 'vue-server-renderer';

/**
 * Development cache for generated bundles and templates.
 *
 * @private
 */
const _cache = {
    _bundle: null,
    set bundle(bundle) {
        this._bundle = JSON.parse(bundle);
    },
    get bundle() {
        return this._bundle;
    },
    _clientManifest: null,
    set clientManifest(clientManifest) {
        this._clientManifest = JSON.parse(clientManifest);
    },
    get clientManifest() {
        return this._clientManifest;
    },
    template: null,
};

/**
 * Creates express middleware for development environment only.
 * This middleware creates the webpack client and server bundle
 * and updates them.
 *
 * @param app Express app
 * @param clientConfig Webpack client configuration
 * @param serverConfig Webpack server configuration
 * @param templatePath Html template path
 * @returns {Function} Express middleware
 */
const createDevMiddleware = (app, {
    clientConfig,
    serverConfig,
    templatePath,
}) => {
    const { publicPath, path } = clientConfig.output;
    const webpack = require('webpack');
    const clientCompiler = webpack(clientConfig);
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath,
        noInfo: true,
    });
    const hotMiddleware = require('webpack-hot-middleware')(clientCompiler, {
        heartbeat: 5000,
    });

    app.use(devMiddleware);
    app.use(hotMiddleware);
    app.use(publicPath, express.static(path));

    clientCompiler.hooks.done.tap('VueBundleMiddleware', stats => {
        const _stats = stats.toJson();

        _stats.errors.forEach(console.error.bind(console));
        _stats.warnings.forEach(console.warn.bind(console));

        if (_stats.errors.length) {
            return;
        }

        _cache.clientManifest = devMiddleware.fileSystem.readFileSync(
            join(path, 'vue-ssr-client-manifest.json'),
            'utf-8',
        );

        console.log(_cache.clientManifest.publicPath);
    });

    _cache.template = readFileSync(templatePath, 'utf-8');
    chokidar.watch(templatePath).on('change', () => {
        _cache.template = readFileSync(templatePath, 'utf-8');
    });

    const serverCompiler = webpack(serverConfig);
    const mfs = new MemoryFs();

    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
        if (err) {
            throw err;
        }

        if (stats.toJson().errors.length) {
            return;
        }

        _cache.bundle = mfs.readFileSync(
            join(path, 'vue-ssr-server-bundle.json'),
            'utf-8',
        );
    });

    return (req, res) => {
        const renderer = createBundleRenderer(_cache.bundle, {
            runInNewContext: false,
            clientManifest: _cache.clientManifest,
            template: readFileSync(join(__dirname, '../../index.html'), 'utf-8'),
        });
        const context = { url: req.url };

        renderer.renderToString(context, (err, html) => {
            if (err) {
                return res.status(500).end(err.message);
            }

            return res.header('Content-type', 'text/html').end(html);
        });
    };
};

/**
 * Creates an express middleware rendering the VueJS bundle.
 *
 * @param bundle Vue server bundle
 * @returns {Function} Express middleware
 */
const createMiddleware = bundle => {
    const renderer = createBundleRenderer(bundle, {
        runInNewContext: false,
    });

    return (req, res) => {
        const context = { url: req.url };

        renderer.renderToString(context, (err, html) => {
            if (err) {
                return res.status(500).end(err.message);
            }

            return res.header('Content-type', 'text/html').end(html);
        });
    };
};

/**
 * Creates express middleware based on the environment.
 * In development mode, a dev server taking care of the webpack build
 * process is provided.
 * In production mode, the resulting server-bundle is served.
 *
 * @param app Express app
 * @param mode NODE_ENV
 * @param clientConfig Webpack client configuration
 * @param serverConfig Webpack server configuration
 * @param serverManifestPath Path to the generated server bundle
 * @param templatePath Path to the html template
 * @returns {Function} Express middleware
 */
export default (app, {
    mode = process.env.NODE_ENV,
    clientConfig = null,
    serverConfig = null,
    serverManifestPath = null,
    templatePath = null,
}) => {
    return mode === 'development' ? createDevMiddleware(app, {
        clientConfig,
        serverConfig,
        templatePath,
    }) : createMiddleware(serverManifestPath);
};
