<script setup>
  import i18next, { t } from 'i18next';
  import moment from 'moment';
import { useQuasar } from 'quasar';
import { useGoodsStore } from 'src/stores/goods';
import { useInventoryStore } from 'src/stores/inventory';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import ListItem from './list-item.vue';


const goodsStore = useGoodsStore();
const inventoryStore = useInventoryStore();

  const router = useRouter();

  const $q = useQuasar();
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

  // const inventory = ref([]);

  // for (let i = 0; i < goodsStore.goods.length; i++){
  //   for (let j = 0; j < goodsStore.goods[i].goods.length; j++){
  //     inventory.value.push(goodsStore.goods[i].goods[j])
  //   }
  // }


  // const inventory = ref([]);
  // function fillInventory() {
  //   for (let i = 0; i < goodsStore.goods.length; i++) {
  //     for (let j = 0; j < goodsStore.goods[i].goods.length; j++) {
  //       let item = {
  //         ...goodsStore.state.goods[i].goods[j],
  //         quant: 0,
  //       };
  //       inventory.value.push(item);
  //     }
  //   }
  // }

  const date = new Date();
  // Format the date using Moment.js
  const formattedDate = moment(date).format('DD.MM.YY');
  const time = date.getTime();
  const formattedTime = moment(time).format('LT').slice(0, -3);

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language)
      await inventoryStore.updateInventory();
    } catch (err) {
      console.error('inventoryStore.updateInventories error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_load_inventory'),
        timeout: 6000,
      })
      router.push('/employee-actions')
    }
  })

</script>

<template>
  <div class="main_container full-height full-width">
    <div class="relative-position">
      <RectangularButton :name="$t('back_to_employee_actions')" :color="'secondary'" size="xl" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/employee-actions')" />

      <div class="text-h2 text-uppercase text-center q-mb-xl title_padding">{{ $t('complete_inventory') }}</div>

      <div class="row justify-between q-mb-md">
        <div class="text-h3 text-capitalize">
          {{ $t('remaining_goods') }}
        </div>
        <div class="text-h3 row q-gutter-md">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>№</span>
        </div>
      </div>
      <DividerBold />
    </div>

    <div class="scroll_area">
      <div class="list_container text-h3">

        <ol class="bg-white text-black relative-position">
          <ListItem
            v-for="good in inventoryStore.inventory"
            :key="good.id"
            :actual_quantity="good.quant"
            :good_name="good.title"
            :estimated_quantity="good.stock"
          />
        </ol>
      </div>
    </div>
    <div>
      <DividerBold class="q-mb-lg" />
      <div class="row justify-between items-center q-mb-xl">
        <div class="text-h4 row q-gutter-sm">
          <span>{{$t('total')}}</span>
          <span>{{inventoryStore.inventory.length}}</span>
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', {count: inventoryStore.inventory.length}) }}</span>
        </div>

        <div class="text-h4 text-weight-regular row q-gutter-sm">
          <div>{{$t('estimated_quantity')}}</div>
          <div>{{totalEstimatedQuantity}}</div>
          <div>{{ $t('pc', {count: totalEstimatedQuantity}) }}</div>
          <q-separator color="secondary" vertical spaced="lg" size="0.2rem" />
          <div>{{$t('actual_quantity')}}</div>
          <div>{{ totalActualQuantity }}</div>
          <div>{{ $t('pc', {count: totalActualQuantity}) }}</div>
        </div>
      </div>
      <div class="row justify-center q-gutter-xl">
        <RectangularButton
          :name="$t('confirm')"
          class="col-5"
          @click="() => console.log('confirm')"
          />
          <RectangularButton
          color="warning"
          :name="$t('declare_discrepancy')"
          class="col-5"
          @click="() => console.log('declare_discrepancy')"
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

.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}
ol li {
  margin-bottom: 2.5rem;
}

</style>
