import express from 'express';
import helmet from 'helmet';
import { resolve } from 'path';
import { log } from 'winston';

import api from './server/api';
import createVueBundleMiddleware from './server/plugins/vue-bundle-middleware';

const configureDevelopment = (app) => {
    const vueBundleMiddleware = createVueBundleMiddleware(app, {
        mode: process.env.NODE_ENV,
        clientConfig: require('../webpack/client/dev'),
        serverConfig: require('../webpack/server/dev'),
        templatePath: resolve(__dirname, 'server/index.html'),
    });

    app.use(vueBundleMiddleware);
};

const configureProduction = (app) => {
    const serverManifestPath = resolve(
        __dirname,
        '../public/assets/vue-ssr-server-bundle.json'
    );

    const vueBundleMiddleware = createVueBundleMiddleware(app, {
        mode: process.env.NODE_ENV,
        serverManifestPath,
    });

    app.use(vueBundleMiddleware);
};

const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';

log('info', `Configuring server for environment: ${process.env.NODE_ENV}...`);
app.use(helmet());
app.set('port', process.env.PORT || 3000);

app.use('/api', api);

if (isDevelopment) {
    configureDevelopment(app);
} else {
    configureProduction(app);
}

app.listen(app.get('port'), () => {
    log('info', `Server listening on port ${app.get('port')}...`);
});
