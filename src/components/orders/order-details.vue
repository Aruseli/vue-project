<script setup>
  import { t } from 'i18next';
import { useOrdersStore } from 'src/stores/orders';
import { computed, onMounted, ref, nextTick, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import DividerThin from '../dividers/divider-thin.vue';
import OrderCard from './order-card.vue';

  const ordersStore = useOrdersStore();
  const route = useRoute();
  const router = useRouter();
  const payment = ref('cash' | 'cashless');

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
    console.log('ordersStore.currentOrder?.payment', ordersStore.currentOrder)
  })

  const showConfirm = ref(false);
  const paymentMethod = (option) => {
    console.log('option0', option)
    if (ordersStore.currentOrder) {
      ordersStore.currentOrder.payment = option;
      payment.value = option
      console.log('option1', payment.value)
    }
    showConfirm.value = true;
    console.log('option2', option)
  }
  const selectedPayment = computed(() => {
    return ordersStore.currentOrder?.payment
  });

  const show = ref(false);

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

        />
      </div>
    </div>
    <div class="q-mb-sm">
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
      <transition name="bounce" mode="out-in">
        <div
          class="full-width row justify-between"
          v-if="ordersStore.currentOrder?.payment == ''"
        >
          <RectangularButton
            :name="$t('cash_payment')"
            @click="paymentMethod('cash')"
            class="payButton button_style_confirm"
            :color="selectedPayment === 'cash' ? 'primary' : 'negative'"
            :textColor="ordersStore.currentOrder?.payment == 'cash' ? 'white' : 'black'"
            :disable="!allowConfirm"

            />
            <RectangularButton
            :color="ordersStore.currentOrder?.payment === 'card' ? 'primary' : 'negative'"
            :name="$t('card_payment')"
            :textColor="ordersStore.currentOrder?.payment == 'card' ? 'white' : 'black'"
            @click="paymentMethod('card')"

            :disable="!allowConfirm"
            class="payButton button_style_confirm"
          />
        </div>
        <div class="full-width" v-else>
          <RectangularButton
            :name="$t('confirm')"
            @click="confirmOrder"
            :disable="!allowConfirm"
            class="full-width button_style_confirm"
          />
        </div>
      </transition>
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
.payButton {
  width: 49%;
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
