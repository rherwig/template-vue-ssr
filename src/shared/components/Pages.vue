<template>
    <div class="root">
        <div>{{ currentPage }} / {{ pages }}</div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'v-pages',
        computed: {
            ...mapState({
                pages: state => state.people.data.pages,
            }),
            ...mapGetters({
                currentPage: 'people/currentPage',
            }),
        },
    };
</script>

<style scoped>

</style>
