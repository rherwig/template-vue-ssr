<template>
    <div id="vue-root">
        <h1>Welcome to VueJS.</h1>
        <section class="intro">
            To start development on your app, head to
            <code> src/shared/components/App.vue </code>
            and hack away!
        </section>
    </div>
</template>

<script>
    export default {
        name: 'app',
    };
</script>

<style scoped>
    #vue-root {
        font-family: sans-serif;
    }

    .intro {
        background-color: #545454;
        color: #FFFFFF;
        padding: 16px;
    }
</style>
