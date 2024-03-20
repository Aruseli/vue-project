<script setup>
  import { t } from 'i18next';
import { useOrdersStore } from 'src/stores/orders';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import DividerThin from '../dividers/divider-thin.vue';
import OrderCard from './order-card.vue';

  const ordersStore = useOrdersStore();
  const route = useRoute();
  const router = useRouter();

  const confirmOrder = async () => {
    await ordersStore.confirmCurrentOrderIssue()
    router.push('/issued-order');
  }

  const allowClickScan = ref(process.env.DEV);

  const allowConfirm = computed(() => {
    return ordersStore.currentOrder?.items?.every(i => i.issued == i.quant)
  });

  onMounted(async () => {
    try {
      await ordersStore.selectOrder(route.params.id)
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

  const paymentMethod = (option) => {
    if (ordersStore.currentOrder) {
      ordersStore.currentOrder.payment = option;
    }
  }

</script>

<template>
  <div class="main_container full-height">
    <div class="relative-position">
      <RectangularButton :name="$t('back_to_order_list')" color="secondary" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/issuing-order')" />

      <div
        class="
          text-h2
          text-uppercase text-center
          q-mb-lg-lg
          q-mb-xs-sm
          q-pt-sm-sm
          q-pt-xs-sm
        "
      >{{ $t('order') }}&ensp;№{{ ordersStore.currentOrder?.orderNumStr }}</div>
    <DividerThin class="q-mb-md-sm q-mb-xs-sm bg-secondary" />
    </div>
    <div class="scroll_area">
      <div class="orders_container q-pa-xs">
        <OrderCard
          v-for="order in ordersStore.currentOrder?.items"
          :key="order.id"
          :good_title="order.title"
          :good_price="order.price"
          :good_quant="order.quant"
          :good_src="order.image.image"
          :good_issued="order.issued"
          :id="order.id"
          @click="() => {
            if (allowClickScan) {
              order.issued += 1;
            }
          }"
        />
      </div>
    </div>
    <div>
      <DividerBold class="q-mb-lg-md q-mb-xs-sm" />
      <div class="column q-mb-lg-md q-mb-xs-sm">
        <div class="row justify-between text-h3 q-mb-lg-md q-mb-xs-sm">
          <div class="q-mr-sm">{{ $t('total') }}</div>
          <div> {{ ordersStore.currentOrder?.totalPrice }}&ensp;&#3647</div>
        </div>
        <DividerThin class="bg-negative q-mb-lg-md q-mb-xs-sm" />
        <div class="text-h3 row q-gutter-x-sm text-weight-regular">
          <span>{{ $t('order') }}</span>&ensp;
          <span>{{ ordersStore.currentOrder?.totalCount }}</span>&ensp;
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', { count: ordersStore.currentOrder?.totalCount }) }}</span>
        </div>
      </div>
      <div class="full-width row justify-between q-mb-sm">
        <RectangularButton
          :name="$t('cash_payment')"
          @click="paymentMethod('cash')"
          class="payButton button_style_confirm"
          :color="ordersStore.currentOrder?.payment  == 'cash' ? 'primary' : 'negative'"
          :textColor="ordersStore.currentOrder?.payment == 'cash' ? 'white' : 'black'"
          :disable="!allowConfirm"
          :class="ordersStore.currentOrder?.payment == 'cash' && 'selected'"
          />
          <RectangularButton
          :color="ordersStore.currentOrder?.payment == 'card' ? 'primary' : 'negative'"
          :name="$t('card_payment')"
          :textColor="ordersStore.currentOrder?.payment == 'card' ? 'white' : 'black'"
          @click="paymentMethod('card')"
          :class="ordersStore.currentOrder?.payment == 'card' && 'selected'"
          :disable="!allowConfirm"
          class="payButton button_style_confirm"
        />
      </div>
      <div class="full-width">
        <RectangularButton
          :name="$t('confirm')"
          @click="confirmOrder"
          :disable="!allowConfirm"
          class="full-width button_style_confirm"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main_container {
  display: grid;
  grid-template-rows: max-content 1fr 0.1fr;
}
.orders_container > *:not(:last-of-type) {
  margin-bottom: var(--px30);
}
.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}

.payButton {
  width: 49%;
  background-color: var(--q-negative);
  // color: black;
}

.selected {
  background-color: var(--q-primary);
  // color: white;
}
</style>
