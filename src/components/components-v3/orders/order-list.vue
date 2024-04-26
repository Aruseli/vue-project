<script setup lang="ts">
  import i18next, { t } from 'i18next';
import { useQuasar } from 'quasar';
import DividerThin from 'src/components/dividers/divider-thin.vue';
import { useGoodsStore } from 'src/stores/goods';
import { useOrdersStore } from 'src/stores/orders';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BackButton from '../buttons/back-button.vue';
import ExistOrder from './exist-order.vue';

  const $q = useQuasar();
  const router = useRouter();
  const goodsStore = useGoodsStore();
  const ordersStore = useOrdersStore();
  const deleteOrder = async (id: string) => {
    await ordersStore.deleteOrder(id);
  }

  const goToOrder = (id: string) => {
    router.push({ path: "/issuing-order/order/" + id });
  };

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language)
      await ordersStore.updateOrders()
    } catch (err) {
      console.error('ordersStore.updateOrders error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_orders'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
  })
</script>

<template>
  <div class="main_container full-height">
    <div class="row justify-center relative-position px-40 pt-40 mb-50">
      <BackButton @click="router.push('/employee-actions')" class="absolute-top-left" />
      <div
        class="text-h2 text-uppercase text-center"
      >{{ $t('open_orders') }}</div>
    </div>
    <DividerThin class="mb-60 bg-grey-1"/>
    <div class="exist_orders_container px-40">
      <transition-group name="list" tag="div">
        <div v-for="order in ordersStore.orders" :key="order.id" class="ghost">
          <ExistOrder
            :order="order"
            @click="goToOrder(order.id)"
            @deleteOrder="deleteOrder(order.id)"
          />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main_container {
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  overflow-y: scroll;
  scrollbar-width: none;
  background-color: white;
}

.ghost {
  transition: all 1s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
}

.list-enter {
  transform: translateY(30%);
}

.list-leave-to {
  transform: translateX(300%);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
