<script setup>
  import DividerBold from '../dividers/divider-bold.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import ArrivalItem from './arrival-item.vue';
  import { onMounted, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useOrderStore } from 'src/stores/order'

  const router = useRouter();
  const { t } = useI18n();
  const orderStore = useOrderStore();

  const items = ref([
    {
      id: 1,
      good_name: 'Product name 1',
      estimated_quantity: 25,
      actual_quantity: 0,
    },
    {
      id: 2,
      good_name: 'Product name 2',
      estimated_quantity: 10,
      actual_quantity: 0,
    },
    {
      id: 3,
      good_name: 'Product name 3',
      estimated_quantity: 20,
      actual_quantity: 0,
    },
  ]);

  const totalEstimatedQuantity = computed(() => {
    return items.value.reduce((acc, curr) => acc + curr.estimated_quantity, 0)
  });

  const totalActualQuantity = computed(() => {
    return items.value.reduce((acc, curr) => acc + curr.actual_quantity, 0)
  });

  onMounted(() => {
    console.log('orderStore', orderStore.orders);
    console.log('totalEstimatedQuantity', totalEstimatedQuantity.value);
    console.log('totalActualQuantity', totalActualQuantity.value);
  })
</script>

<template>
  <div class="main_container full-height full-width">
    <div class="relative-position q-mb-xl">
      <router-link :to="{ path: '/employee-actions' }" class='router_link_style text-secondary absolute-top-left'>
        {{ t('back_to_employee_actions') }}
      </router-link>

      <div class="text-h2 text-uppercase text-center q-mb-xl title_padding">{{ t('arrival_goods') }}</div>

      <div class="row justify-between q-mb-md">
        <div class="text-h3 text-capitalize">
          {{ t('remaining_goods') }}
        </div>
        <div class="text-h3">
          {{ '10.12.23 12:00' }}&ensp;{{ '№0000087' }}
        </div>
      </div>
      <DividerBold />
    </div>

    <div class="scroll_area">
      <ArrivalItem />
    </div>
    <div>
      <DividerBold class="q-mb-lg" />
      <div class="row justify-between items-center q-mb-xl">
        <div class="text-h4 row q-gutter-sm">
          <span>{{t('total')}}</span>
          <span>{{items.length}}</span>
          <span>{{ t('product') }}</span>
        </div>

        <div class="text-h4 text-weight-regular row q-gutter-sm">
          <div>{{t('estimated_quantity')}}</div>
          <div>{{totalEstimatedQuantity}}</div>
          <div>{{ t('pcs') }}</div>
          <q-separator color="secondary" vertical spaced="lg" size="0.2rem" />
          <div>{{t('actual_quantity')}}</div>
          <div>{{ totalActualQuantity }}</div>
          <div>{{ t('pcs') }}</div>
        </div>
      </div>
      <div class="full-width">
        <RectangularButton
          name="confirm"
          class="fit"
          @click="() => console.log('confirm')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main_container {
  display: grid;
  grid-template-rows: max-content 1fr 0.1fr;
}
.scroll_area {
  overflow-y: scroll;
  padding: 0.5rem;
}

.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}
ol li {
  margin-bottom: 2.5rem;
}

</style>
