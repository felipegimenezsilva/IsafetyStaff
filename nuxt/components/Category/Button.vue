<style>
    .category{
        padding : 20px;
        /*background-color: #ffffff12;*/
        background-color: #0000008f;
        text-align:center;
        border-radius: 5px;
        min-width: 100%;
        color: whitesmoke;
    }
    .category:hover {
        background-color: blue;
    }
</style>

<template>
    <div class="row" >
        <div class="col-12 category">
            {{ title }}
        </div>
    </div>
</template>

<script setup>
    const { title } = defineProps(['title'])
</script>