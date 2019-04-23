import Vue from 'vue';
import axios from 'axios';

export default {
    namespaced: true,
    state: {
        data: {
            people: {},
            pages: 0,
            currentPage: 1,
        },
    },
    getters: {
        currentPage(state, getters, rootState) {
            return parseInt(rootState.route.params.page || 1, 10);
        },
        people(state, getters) {
            return state.data.people[getters.currentPage];
        },
    },
    mutations: {
        setPeople(state, { people, page }) {
            Vue.set(state.data.people, page, people);
        },
        setPages(state, pages) {
            Vue.set(state.data, 'pages', pages);
        },
    },
    actions: {
        async fetch({ commit }, page = 1) {
            const url = 'http://localhost:3000/api/people';
            const take = 12;
            const skip = (page - 1) * 12;

            const response = await axios.get(
                `${url}?skip=${skip}&take=${take}`
            );

            const { people, pages } = response.data;

            commit('setPeople', { people, page });
            commit('setPages', pages);
        },
    },
};
