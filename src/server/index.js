import createApp from '../shared';

export default context => new Promise((resolve, reject) => {
    const { app } = createApp();

    return resolve(app);
});
