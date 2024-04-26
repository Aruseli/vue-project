<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useOrdersStore } from 'src/stores/orders';
  import { useAppStore } from 'src/stores/app';
  import IssuedOrder from 'src/components/components-v3/orders/issued-order.vue';
  import { default as OrderListOld } from '../components/orders/issued-order.vue';

  const ordersStore = useOrdersStore();
  const app = useAppStore();
  const router = useRouter();

  const goToOrderedList = () => {
    router.push('/issuing-order');
  }
  const goToEmployeeActions = () => {
    router.push('/employee-actions');
  }

</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <IssuedOrderOld v-if="app.kioskState.settings?.alt_ui !== 'design_v3'" />
    <IssuedOrder v-if="app.kioskState.settings?.alt_ui === 'design_v3'" />
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
  @media (max-width: 1400px) and (orientation: landscape) {
    padding: 1.5rem;
  }
  @media(max-width: 1300px) {
    padding: 1.5rem;
  }
  @media(max-width: 900px) {
    padding: 1rem;
  }
}

.container > *:nth-child(-n+2) {
  margin-bottom: var(--px90);
  @media(max-width: 1300px) {
    margin-bottom: var(--px30);
  }
  @media(max-width: 900px) {
    margin-bottom: 1rem;
  }
}

.title_style {
  padding: 0 5rem;
  @media(max-width: 1300px) {
    padding: 0 2rem;
  }
  @media(max-width: 900px) {
    padding: 0 1rem;
  }
}
.divider_bold_style {
  margin-bottom: var(--px60);
  @media(max-width: 1300px) {
    margin-bottom: var(--px30);
  }
  @media(max-width: 900px) {
    margin-bottom: 1rem;
  }
}

.img_style {
  width: 25rem;
  height: 25rem;
  @media (max-width: 1400px) and (orientation: landscape) {
    width: 10rem;
    height: 10rem;
  }
  @media(max-width: 1300px) {
    width: 15rem;
    height: 15rem;
  }
  @media(max-width: 900px) {
    width: 10rem;
    height: 10rem;
  }
  @media(max-width: 500px) {
    width: 7rem;
    height: 7rem;
  }
}
</style>
