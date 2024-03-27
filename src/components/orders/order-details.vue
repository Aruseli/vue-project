<script setup>
  import { t } from 'i18next';
import { useOrdersStore } from 'src/stores/orders';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import DividerThin from '../dividers/divider-thin.vue';
import OrderCard from './order-card.vue';
import i18next from 'i18next'
import { apiReportsGetView, wsSendMessage } from 'src/services';
import { useQuasar } from 'quasar';

  const $q = useQuasar();
  const ordersStore = useOrdersStore();
  const route = useRoute();
  const router = useRouter();
  const payment = ref('cash' | 'cashless');

  const confirmOrder = async () => {
    const doc = ordersStore.currentOrderDocument
    if(!doc) {
      return;
    }

    await ordersStore.confirmCurrentOrderIssue()

    console.log("FREEPHOENIX GOING TO PRINT")
    const documentId = doc.id;
    try {
      const orderViewId = "ff7ce8d1-989f-4fc6-9ad4-4aacf65da9f8";
      const langCode = i18next.language;
      const viewData = await apiReportsGetView(orderViewId, [
        {
          "name": "doc_id",
          "value": documentId,
          "expression": documentId
        },
        {
          "name": "lang_code",
          "value": langCode,
          "expression": langCode
        }
      ]);
      console.log({viewData});
      wsSendMessage('check-print', viewData);
    }
    catch(e) {
      console.log(e);
      $q.notify({
        message: 'Error occured',
        icon: 'warning',
        color: 'warning',
      });
    }
    finally {
      $q.loading.hide();
    }

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
      <RectangularButton :name="$t('back_to_order_list')" :color="'secondary'" size="xl" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/issuing-order')" />

      <div class="text-h1 text-uppercase text-center q-mb-md title_padding">{{ $t('order') }}&ensp;№{{ ordersStore.currentOrder?.orderNumStr }}</div>
    <DividerThin class="q-mb-xl bg-secondary" />
    </div>
    <div class="scroll_area">
      <div class="orders_container">
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
      <DividerBold class="q-mb-md" />
      <div class="row justify-between items-center q-mb-md">
        <div class="text-h4">{{ $t('total') }}</div>
        <div class="text-h3 q-mb-md">
          {{ ordersStore.currentOrder?.totalPrice }} &ensp;&#3647
        </div>
        <DividerThin class="bg-negative q-mb-md" />
        <div class="text-h4 row q-gutter-sm text-weight-regular">
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
          class="payButton"
          :color="ordersStore.currentOrder?.payment  == 'cash' ? 'primary' : 'negative'"
          :textColor="ordersStore.currentOrder?.payment == 'cash' ? 'white' : 'black'"

          :class="ordersStore.currentOrder?.payment == 'cash' && 'selected'"
          />
          <RectangularButton
          :color="ordersStore.currentOrder?.payment == 'cashless' ? 'primary' : 'negative'"
          :name="$t('cashless_payment')"
          :textColor="ordersStore.currentOrder?.payment == 'cashless' ? 'white' : 'black'"
          @click="paymentMethod('cashless')"
          :class="ordersStore.currentOrder?.payment == 'cashless' && 'selected'"

          class="payButton"
        />
      </div>
      <div class="full-width">
        <RectangularButton
          :name="$t('confirm')"
          @click="confirmOrder"
          :disable="!allowConfirm"
          class="full-width"
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
