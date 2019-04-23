<template>
    <div>
        <div v-if="isFetching">
            Loading data...
        </div>
        <v-people />
    </div>
</template>
<script>
    import { mapActions, mapState } from 'vuex';

    import VPeople from '../components/People';

    export default {
        components: { VPeople },
        data() {
            return {
                isFetching: false,
            };
        },
        computed: {
            ...mapState({
                allPeople: state => state.people.data.people,
            }),
        },
        methods: {
            ...mapActions({
                fetchPeople: 'people/fetch',
            }),
        },
        async mounted() {
            await this.fetchPeople();
        },
        async beforeRouteUpdate(to, from, next) {
            const { page } = to.params;
            if (this.allPeople[page]) {
                return next();
            }

            this.isFetching = true;
            await this.fetchPeople(page);
            this.isFetching = false;

            return next();
        },
    };
</script>
