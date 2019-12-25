<template>
    <div id="app">
        <router-view/>
        <loading></loading>
    </div>
</template>

<script>
    import Loading from "@/components/Loading"

    export default {
        name: 'App',
        components: {
            Loading
        }
    }
</script>
