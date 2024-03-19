<script setup>
  import i18next, { t } from 'i18next';
  import moment from 'moment';
  import { useQuasar } from 'quasar';
  import { useGoodsStore } from 'src/stores/goods';
  import { useInventoryStore } from 'src/stores/inventory';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import DividerBold from '../dividers/divider-bold.vue';
  import ListItem from './list-item.vue';
  import { useAppStore } from 'src/stores/app';


  const goodsStore = useGoodsStore();
  const inventoryStore = useInventoryStore();
  const app = useAppStore();

  const router = useRouter();
  const route = useRoute();

  const $q = useQuasar();

  const allowConfirm = computed(() => {
    return inventoryStore.inventory?.every(i => i.stock == i.quant)
  });

  async function submitInventory() {
    try {
      if (route.path === '/open-shift/complete-inventory') {
        await inventoryStore.submitInventory();
        await app.openTerminalShift();
        router.push(app.shiftIsGood ? '/hello' : '/employee-actions' );
      } else if (route.path == '/close-shift/complete-inventory') {
        await inventoryStore.submitInventory();
        await app.closeTerminalShift();
        router.push('/employee-actions');
      } else {
        await inventoryStore.submitInventory();
        router.push('/employee-actions');
      }
    } catch (err) {
      console.error('inventoryStore.submitInventory error:', err)
      $q.notify({
        color: 'warning',
        icon: 'warning',
        position: 'center',
        message: t('unable_to_submit_inventory'),
        timeout: 6000,
      })
    }
  }

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
      <RectangularButton :name="$t('back_to_employee_actions')" :color="secondary" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/employee-actions')" />

      <div
        class="
          text-h2
          text-uppercase text-center
          q-mb-lg-lg
          q-mb-xs-sm
          q-pt-sm-sm
          q-pt-xs-sm
        "
      >{{ $t('complete_inventory') }}</div>

      <div
        class="
          row justify-between
          q-mb-md-sm
          q-mb-xs-sm
        "
      >
        <div class="text-capitalize text-h5">
          {{ $t('remaining_goods') }}
        </div>
        <div class="row date_style text-h5">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>№ {{ inventoryStore.docNumStr }}</span>
        </div>
      </div>
      <DividerBold />
    </div>

    <div class="scroll_area">
      <div>
        <ol class="bg-white text-black relative-position q-pl-none">
          <ListItem
            v-for="good in inventoryStore.inventory"
            :key="good.id"
            :actual_quantity="good.quant"
            :good_name="good.title"
            :estimated_quantity="good.stock"
            :not_equal="good.stock !== good.quant"
            :class="{ 'highlighted': good.confirmed }"
            @click="good.confirmed = !good.confirmed"
          />
        </ol>
      </div>
    </div>
    <div>
      <DividerBold
        class="
          q-mb-lg-lg
          q-mb-md-sm
          q-mb-xs-sm
        "
      />
      <div
        class="
          row justify-between items-center
          q-mb-lg-xl
          q-mb-md-md
          q-mb-xs-sm
        "
      >
        <div class="row text-h5">
          <span class="q-mr-xs-xs">{{$t('total')}}</span>
          <span class="q-mr-xs-xs">{{inventoryStore.inventory.length}}</span>
          <span class="q-mr-xs-xs">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: inventoryStore.inventory.length}) }}</span>
        </div>

        <div class="text-h5 text-weight-regular row">
          <div class="q-mr-xs-xs">{{$t('estimated_quantity')}}</div>
          <div class="q-mr-xs-xs">{{inventoryStore.totalQuantity}}</div>
          <div class="q-mr-xs-xs">{{ $t('pc', {count: inventoryStore.totalQuantity}) }}</div>
          <q-separator color="secondary" vertical class="q-mr-xs-xs" size="0.2rem" />
          <div class="q-mr-xs-xs">{{$t('actual_quantity')}}</div>
          <div class="q-mr-xs-xs">{{ inventoryStore.totalActualQuant }}</div>
          <div>{{ $t('pc', {count: inventoryStore.totalActualQuant}) }}</div>
        </div>
      </div>
      <div class="row justify-evenly">
        <RectangularButton
          :name="$t('confirm')"
          class="col-5 button_style_confirm"
          @click="submitInventory"
        />
        <RectangularButton
          color="warning"
          :name="$t('declare_discrepancy')"
          class="col-5 button_style_confirm"
          @click="submitInventory"
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
