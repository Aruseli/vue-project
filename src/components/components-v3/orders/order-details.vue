<script setup lang="ts">
  import { t } from 'i18next';
import { useQuasar } from 'quasar';
import { printCheck } from 'src/services';
import { useAppStore } from 'src/stores/app';
import { useOrdersStore } from 'src/stores/orders';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../../dividers/divider-bold.vue';
import DividerThin from '../../dividers/divider-thin.vue';
import BackButton from '../buttons/back-button.vue';
import OrderCard from './order-card.vue';

  const $q = useQuasar();
  const appStore = useAppStore();
  const ordersStore = useOrdersStore();
  const route = useRoute();
  const router = useRouter();

  const confirmOrder = async () => {
    const doc = ordersStore.currentOrderDocument
    if(!doc) {
      return;
    }
    await ordersStore.confirmCurrentOrderIssue()
    await printCheck({documentId: doc.id, $q, appStore})
    router.push('/issued-order');
  }

  const allowClickScan = ref(process.env.DEV);

  const allowConfirm = computed(() => {
    return ordersStore.currentOrder?.items?.every(i => i.issued == i.quant)
  });

  onMounted(async () => {
    try {
      await ordersStore.selectOrder(typeof route.params.id === 'string' ? route.params.id : route.params.id[0])
    } catch (err) {
      console.error('ordersStore.selectOrder error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_order'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
  })

  const paymentMethod = (option: 'cash' | 'card') => {
    if (ordersStore.currentOrder) {
      ordersStore.currentOrder.payment = option;
    }
  }
</script>

<template>
  <div class="main_container full-height">
    <div class="row justify-center relative-position q-mb-xl px-40 pt-40">
      <BackButton @click="router.push('/issuing-order')" class="absolute-top-left" />
      <div
        class="text-h2 text-uppercase text-center"
      >{{ $t('order') }}&ensp;№{{ ordersStore.currentOrder?.orderNumStr }}</div>
    </div>
    <DividerThin class="mb-60 bg-grey-1" />
    <div class="scroll_area px-40">
      <div class="orders_container">
        <OrderCard
          v-for="order in ordersStore.currentOrder?.items"
          :key="order.id"
          :good="order"
        />
      </div>
    </div>
    <DividerBold class="mb-30" />
    <div class="px-40 pb-20">
      <div class="column">
        <div class="row justify-between text-h2 text-uppercase">
          <div class="q-mr-sm">{{ $t('total') }}</div>
          <div> {{ ordersStore.currentOrder?.totalPrice }}&ensp;&#3647</div>
        </div>

        <div class="text-h3 row q-gutter-x-sm text-weight-bold">
          <span>{{ $t('order') }}</span>&ensp;
          <span>{{ ordersStore.currentOrder?.totalCount }}</span>&ensp;
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', { count: ordersStore.currentOrder?.totalCount }) }}</span>
        </div>
      </div>
    </div>
    <DividerThin class="bg-grey-1 mb-40" />
    <div class="column items-center px-100 pb-40 full-width buttons_container">
      <RectangularButton
        :name="$t('cash_payment')"
        @click="paymentMethod('cash')"
        :color="allowConfirm ? 'grey-3' : 'grey'"
        :textColor="ordersStore.currentOrder?.payment == 'cash' ? 'green' : 'white'"
        :disable="!allowConfirm"
        class="cash_class"
      />
      <RectangularButton
        :color="allowConfirm ? 'grey-3' : 'grey'"
        :name="$t('card_payment')"
        :textColor="ordersStore.currentOrder?.payment == 'card' ? 'green' : 'white'"
        @click="paymentMethod('card')"
        :disable="!allowConfirm"
        class="card_class"
      />
      <RectangularButton
        :name="$t('confirm')"
        @click="confirmOrder"
        :color="ordersStore.currentOrder?.payment !== '' ? 'grey-3' : 'grey'"
        :disable="ordersStore.currentOrder?.payment == ''"
        class="full-width confirm_class"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.main_container {
  display: grid;
  grid-template-rows: repeat(2, max-content) 1fr repeat(2, max-content);
  background-color: white;
}
.orders_container > *:not(:last-of-type) {
  margin-bottom: var(--px30);
}
.buttons_container {
  display: grid;
  grid-template-areas: "cash card"
                       "confirm confirm";
  column-gap: var(--px60);
  row-gap: var(--px30);
}
.cash_class {
  grid-area: cash;
}
.card_class {
  grid-area: card;
}
.confirm_class {
  grid-area: confirm;
}
.payButton {
}

.selected {
  background-color: var(--q-primary);
  color: white;
}


.bounce-enter-from {
  opacity: 0;
}
.bounce-enter-to {
  opacity: 1;
}
.bounce-enter-active {
  transition: opacity 2s cubic-bezier(0.215, 0.610, 0.355, 1);
}
.bounce-leave-active {
  transition: opacity 3s cubic-bezier(0.215, 0.610, 0.355, 1);
}
</style>
