<script setup lang="ts">
import { useAppStore } from '../../stores/app';
import moment from 'moment';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const app = useAppStore();
const date = new Date();
const time = date.getTime();
const formattedTime = moment(time).format("LT").slice(0, -3);

const textColorClass = ref('text-black'); // Начальное значение

watch(() => app.colorMode, (newValue) => {
  textColorClass.value = newValue === 'dark' ? 'text-white' : 'text-black';
});

router.beforeEach((to, from, next) => {
  if (typeof to.meta.colorMode === 'string') {
    app.colorMode = to.meta.colorMode;
  } else {
    app.colorMode = 'light'; // Значение по умолчанию
  }
  next();
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
