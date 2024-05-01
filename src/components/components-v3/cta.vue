<script setup lang="ts">
import { useCartStore } from '../../stores/cart';
import { useAppStore } from 'src/stores/app';

const app = useAppStore();
const cartStore = useCartStore();

const emit = defineEmits(['click']);
</script>

<template>
  <div class="toast_container row justify-between items-center pa-20 bg-grey-2">
    <div class="column">
      <div class="text-h2 text-uppercase q-mb-xl">{{ $t('your_order') }}</div>
      <div>
        <div class="text-h4 mb-16">
          {{ $t('positions', { count: cartStore.totalQuantity }) }}: <span>{{ cartStore.totalQuantity }}</span>
        </div>
        <div class="text-h4 row">
          <div class="text-uppercase q-mr-sm">{{ $t('total') }}:</div>
          <div>{{ cartStore.totalPrice }}&ensp;&#3647</div>
        </div>
      </div>
    </div>
    <div role="button" class="text-h2 text-green text-uppercase" @click="emit('click')">{{ $t('view_order') }}
      <q-icon
        name="arrow_forward_ios"
        class="text-green"
        size="2.5em"
        :class="[app.lang_dir == 'rtl' ? 'direction' : '']"
      /></div>
  </div>
</template>

<style scoped>
.toast_container {
  border-top: var(--border);
  border-right: var(--border);
  border-bottom: var(--border);
}
.direction {
  transform: rotateY(180deg);
}
</style>
