<script setup lang="ts">
import { useAppStore } from '../../stores/app';
import moment from 'moment';
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { apiHealthCheck, ws } from "src/services";
import config from "src/services/config";
import { useRouter } from 'vue-router';
import { terminalName } from 'src/services/terminal';

const router = useRouter();
const app = useAppStore();
const formattedTime = ref(moment().format("LT").slice(0, -3));
let healthCheckInterval: NodeJS.Timeout;
const isCatUnhealthy = ref(false);
const isWsHealthy = ref(false);

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

onMounted(() => {
  healthCheckInterval = setInterval(async () => {
    formattedTime.value = moment().format("LT").slice(0, -3);
    isCatUnhealthy.value  = !(await apiHealthCheck(config.cat_health_check_interval_ms));
    isWsHealthy.value = !!ws?.OPEN;
  }, config.cat_health_check_interval_ms);
});

onUnmounted(() => {
  clearInterval(healthCheckInterval);
});
</script>

<template>
  <div class="row ping_block"
    :class="[app.lang_dir == 'rtl' ? 'ping_container_rtl' : 'ping_container']"
  >
    <div :class="textColorClass">{{ terminalName }}</div>
    <div :class="textColorClass">{{ formattedTime }}</div>
    <div :class="!isCatUnhealthy ? 'ping_cat_light' : 'ping_cat_light__not_signal'" />
    <div :class="isWsHealthy ? 'ping_tdp_light' : 'ping_tdp_light__not_signal'" />
  </div>
  <q-dialog
      v-model="isCatUnhealthy"
      persistent
      full-width
      transition-show="slide-up"
      transition-hide="slide-down"
    >
    <q-card  class='bg-secondary no-box-shadow'>
      <q-card-section>
        <div class="text-h2 text-white text-center q-my-xl">{{ $t('out_of_network') }}</div>
      </q-card-section>
    </q-card>
    </q-dialog>
</template>

<style scoped>
.ping_block {
  z-index: 111;
}
</style>
