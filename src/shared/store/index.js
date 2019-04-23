import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import modules from './modules';

Vue.use(Vuex);

export default () => new Store({
    modules,
});
