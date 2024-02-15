<script setup>
  import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import ListItem from './list-item.vue';
import { useSelectInventoryStore } from 'src/stores/selective-inventory';
import { useGoodsStore } from 'src/stores/goods';
import { useQuasar } from 'quasar';
import i18next from 'i18next';

  const $q = useQuasar();

  const router = useRouter();
  const route = useRoute();
  const selectInventoryStore = useSelectInventoryStore();
  const goodsStore = useGoodsStore();

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language)
      await selectInventoryStore.updateInventories();
      // await selectInventoryStore.selectedInventory(route.params.id);
    } catch (err) {
      console.error('selectInventoryStore.updateInventories error:', err)
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
  const confirmInventory = async () => {
    await selectInventoryStore.confirmSelectedInventory()
    router.push('/employee-actions');
    // TODO возможно стоит добавить диалоговое окно, перед редиректом, с информацией что товар добавлен
  }

</script>

<template>
  <div class="main_container full-height full-width">
    <div class="relative-position">
      <RectangularButton :name="$t('back_to_employee_actions')" :color="'secondary'" size="xl" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/employee-actions')" />

      <div class="text-h2 text-uppercase text-center q-mb-xl title_padding">{{ $t('selective_inventory') }}</div>

      <div class="row justify-between q-mb-md">
        <div class="text-h3 text-capitalize">
          {{ $t('remaining_goods') }}
        </div>
        <div class="text-h3">
          {{ '10.12.23 12:00' }}&ensp;{{  }}
        </div>
      </div>
      <DividerBold />
    </div>

    <div class="scroll_area">
      <div class="list_container text-h3">

        <ol class="bg-white text-black relative-position">
          <ListItem
            v-for="inv in selectInventoryStore.selectInventory?.items"
            :key="inv.id"
            :actual_quantity="inv.quant"
            :good_name="inv.title"
            :estimated_quantity="inv.stock"
          />
        </ol>
      </div>
    </div>
    <div>
      <DividerBold class="q-mb-lg" />
      <div class="row justify-between items-center q-mb-xl">
        <div class="text-h4 row q-gutter-sm">
          <span>{{$t('total')}}</span>
          <span>{{selectInventoryStore.selectInventory?.items.length}}</span>
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', {count: selectInventoryStore.selectInventory?.items.length}) }}</span>
        </div>

        <div class="text-h4 text-weight-regular row q-gutter-sm">
          <div>{{$t('estimated_quantity')}}</div>
          <div>{{selectInventoryStore.selectInventory?.totalStock}}</div>
          <div>{{ $t('pc', {count: selectInventoryStore.selectInventory?.totalStock}) }}</div>
          <q-separator color="secondary" vertical spaced="lg" size="0.2rem" />
          <div>{{$t('actual_quantity')}}</div>
          <div>{{ selectInventoryStore.selectInventory?.totalCount }}</div>
          <div>{{ $t('pc', {count: selectInventoryStore.selectInventory?.totalCount}) }}</div>
        </div>
      </div>
      <div class="row justify-center q-gutter-xl">
        <RectangularButton
          name="confirm"
          class="col-5"
          @click="confirmInventory"
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
