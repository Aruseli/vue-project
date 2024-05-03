<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import DividerThin from '../../dividers/divider-thin.vue';
  import Bin from './bin.vue';
  import { useCartStore } from 'src/stores/cart';
  import { ref } from 'vue';
  import DialogDelete from './dialog-delete.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';

  const cartStore = useCartStore();
  const $q = useQuasar();

  const emit = defineEmits(['click', 'deleteOrder']);

  const props = defineProps({
    order: {
      type: Object,
      required: true,
    },
  })

  const isDisabled = ref(false);

  const openDialog = ref(false);
  const open = () => {
    openDialog.value = true;
  }
</script>

<template>
  <div class="order_item column justify-between bg-white pa-20 mb-40" v-bind="$attrs" @click="emit('click')">
    <div class="row justify-between items-center mb-10">
      <div class="text-h3">
        № {{ props.order.orderNumStr }}
      </div>
      <div class="text-h2">
        &#3647&ensp;{{ props.order.totalPrice }}
      </div>
    </div>
    <DividerThin class="bg-grey-1 mb-10" />
    <div class="row justify-between items-center">
      <div class="text-h4 text-weight-regular">
        {{ props.order.allTitles }}
      </div>
      <Bin @click="open" class="px-0" :round="false" :disable="isDisabled" />
    </div>
  </div>
  <DialogDelete :modelValue="openDialog" title="delete_order">
    <template #content>
      <div class="text-center text-uppercase text-h3 mb-20">№ {{ props.order.orderNumStr }}</div>
    </template>
    <template #actions>
      <RectangularButton
        :name="$t('no')"
        @click="openDialog = false"
        />
        <RectangularButton
        :name="$t('yes')"
        @click="emit('deleteOrder')"
        />
    </template>
  </DialogDelete>
</template>

<style scoped lang="scss">
.order_item {
  width: 100%;
  height: max-content;
  border-radius: var(--border-xxs);
  box-shadow: var(--border-shadow);
}

</style>
