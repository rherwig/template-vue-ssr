<template>
    <div>
        <div class="people-container">
            <div class="people" v-for="person in people" :key="person.id">
                {{ person.first_name }} {{ person.last_name }}
            </div>
        </div>
        <v-pages />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';

    import VPages from './Pages';

    export default {
        name: 'v-people',
        components: { VPages },
        computed: {
            ...mapGetters({
                people: 'people/people'
            }),
        },
    };
</script>

<style scoped>
    .people-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(4, 1fr);
        grid-gap: 16px;
        margin-bottom: 32px;
    }

    .people {
        border: 1px solid rgba(0, 0, 0, 0.3);
        padding: 16px;
    }
</style>
