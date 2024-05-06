<script setup lang="ts">
import { useAppStore } from '../../stores/app';
import moment from 'moment';
import { computed, ref, watch } from 'vue';
const app = useAppStore();
const date = new Date();
const time = date.getTime();
const formattedTime = moment(time).format("LT").slice(0, -3);

const textColorClass = ref('text-black'); // Начальное значение
// const textColorClass = computed(() => app.colorMode === 'dark' ? 'text-white' : 'text-black');

watch(() => app.colorMode, (newValue) => {
  textColorClass.value = newValue === 'dark' ? 'text-white' : 'text-black';
});
</script>

<template>
  <div class="row ping_block"
    :class="[app.lang_dir == 'rtl' ? 'ping_container_rtl' : 'ping_container']"
  >
    <div :class="textColorClass">{{ app.kioskState.name }}</div>
    <div :class="textColorClass">{{ formattedTime }}</div>
    <div class="ping_cat_light bg-green-10" />
    <div
      :class="[app.kioskState.settings?.tdp ? 'ping_tdp_light' : 'ping_tdp_light_not__signal' ,'bg-green']"
    />
  </div>
</template>

<style scoped>
.ping_block {
  z-index: 111;
}
</style>
