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

  const emit = defineEmits(['click']);

  const props = defineProps({
    good_price: {
      type: Number,
      required: true,
    },
    good_title: {
      type: String,
      required: false,
    },
    order_number: {
      type: String,
      required: false
    },
  })

  const isDisabled = ref(false);

  const openDialog = ref(false);
  const open = () => {
    openDialog.value = true;
    console.log('123')
  }

  // async function deleteOrder() {
  //   // кнопка будет недоступна для повторного клика
  //   isDisabled.value = true;
  //   try {
  //     await cartStore.deleteOrder({$q})
  //     app.openOrderDialog(true);
  //     setTimeout(() => {
  //       app.openOrderDialog(false);
  //       closeDrawerCart();
  //       cartStore.clearCart();
  //       router.push('hello');
  //     }, app.kioskState.settings?.customer_successful_order_notify_duration_ms ?? 7000);
  //   } catch (err) {
  //     console.error('ordersStore.selectOrder error:', err)
  //     $q.notify({
  //       color: 'warning',
  //       icon: 'warning',
  //       position: 'center',
  //       message: t('unable_to_submit_order'),
  //       timeout: 6000,
  //     })
  //   } finally {
  //     isDisabled.value = false
  //   }
  // }
</script>

<template>
  <div class="order_item column justify-between bg-white pa-20" @click="emit('click')">
    <div class="row justify-between items-center mb-10">
      <div class="text-h3">
        № {{ props.order_number }}
      </div>
      <div class="text-h2">
        &#3647&ensp;{{ props.good_price }}
      </div>
    </div>
    <DividerThin class="bg-grey-1 mb-10" />
    <div class="row justify-between items-center">
      <div class="text-h4 text-weight-regular">
        {{ props.good_title }}
      </div>
      <Bin @click="open" :disable="isDisabled" />
    </div>
  </div>
  <DialogDelete :modelValue="openDialog" title="delete_order">
    <template #content>
      <div class="text-center text-uppercase text-h3 mb-20">№ {{ props.order_number }}</div>
    </template>
    <template #actions>
      <RectangularButton
        :name="$t('no')"
        @click="openDialog = false"
        />
        <RectangularButton
        :name="$t('yes')"
        @click="console.log('yes')"
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
