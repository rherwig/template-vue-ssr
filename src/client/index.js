import createApp from '../shared';

const { app, router, store } = createApp();

// store.dispatch('people/fetch');

router.onReady(() => {
    app.$mount('#vue-root');
});
