<script setup>
import { useCartStore } from '../../stores/cart';

const cartStore = useCartStore();
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click']);
</script>

<template>
  <transition name="toast">
    <div v-show="props.show" class="toast_container row justify-between items-center pa-20 bg-grey-2">
      <div class="column">
        <div class="text-h4 text-uppercase q-mb-xl">{{ $t('your_order') }}</div>
        <div>
          <div class="text-h5 text-capitalize q-mb-xs">
            {{ $t('positions', { count: cartStore.totalQuantity }) }}: <span>{{ cartStore.totalQuantity }}</span>
          </div>
          <div class="text-h5 row">
            <div class="text-uppercase q-mr-sm">{{ $t('total') }}:</div>
            <div>{{ cartStore.totalPrice }}&ensp;&#3647</div>
          </div>
        </div>
      </div>
      <div class="text-h4 text-green text-uppercase" @click="emit('click')">{{ $t('view_order') }} <q-icon name="arrow_forward_ios" class="text-green" size="2.5em" /></div>
    </div>
  </transition>
</template>

<style>
.toast_container {
  border-top: var(--border);
  border-right: var(--border);
  border-bottom: var(--border);
}
</style>
