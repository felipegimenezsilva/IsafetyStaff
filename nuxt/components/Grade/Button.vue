<style scoped>
    .circle {
        border-radius: 10px;
        aspect-ratio: 1;
        border-color: rgba(255, 255, 255, 0);
        border-style: solid;
        box-shadow: 0px 0px 30px 0px;
    }
    .circle:hover{
        box-shadow: 0px 0px 15px 0px;
    }
</style>

<template>
    <div v-if="type=='bad'" class="circle col-2" style="color: red;" @click="$emit('click',0)">
        <div class='row' style="aspect-ratio: 1;">
            <FaceBad/>
        </div>
    </div>
    <div v-if="type=='neutral'" class="circle col-2" style="color: orange;" @click="$emit('click',1)">
        <div class='row' style="aspect-ratio: 1;">
            <FaceNeutral/>
        </div>
    </div>
    <div v-if="type=='good'" class="circle col-2" style="color: yellow;" @click="$emit('click',2)">
        <div class='row' style="aspect-ratio: 1;">
            <FaceGod/>
        </div>
    </div>
    <div v-if="type=='veryGood'" class="circle col-2" style="color: yellowgreen;"  @click="$emit('click',3)">
        <div class='row' style="aspect-ratio: 1;">
            <FaceVeryGood/>
        </div>
    </div>
</template>

<script setup>

const {type} = defineProps(['type'])
const {emits} = defineEmits(['click'])

</script>