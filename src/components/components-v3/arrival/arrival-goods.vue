<script setup lang="ts">
  import i18next from 'i18next';
  import { t } from 'i18next';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useArrivalsStore } from 'src/stores/arrivals';
import { useGoodsStore } from 'src/stores/goods';
import { useAppStore } from 'src/stores/app';
import { apiReportsGetView, printGoodsArrival, wsSendMessage } from 'src/services';
import RectangularButton from '../buttons/rectangular-button.vue';
import BackButton from '../buttons/back-button.vue';
import DividerBold from '../../dividers/divider-bold.vue';
import ArrivalItem from './arrival-item.vue';
import DividerThin from 'src/components/dividers/divider-thin.vue';

const goodsStore = useGoodsStore();

  const $q = useQuasar();

  const arrivalsStore = useArrivalsStore();
  const router = useRouter();
  const route = useRoute();
  const appStore = useAppStore();

  const allowConfirm = computed(() => {
    return arrivalsStore.arrival?.items?.every(i => i.issued == i.quant)
  });

  const confirmArrival = async () => {
    await arrivalsStore.confirmArrivalGoodsIssue()
    router.push('/employee-actions');
    // TODO возможно стоит добавить диалоговое окно, перед редиректом, с информацией что товар добавлен
  }

  // Get the current date
  const date = new Date();
  // Format the date using Moment.js
  const formattedDate = moment(date).format('DD.MM.YY');
  const time = date.getTime();
  const formattedTime = moment(time).format('LT').slice(0, -3);

  onMounted(async () => {
    try {
      await goodsStore.updateGoods(i18next.language);
      await arrivalsStore.updateArrivals();
      await arrivalsStore.selectArrival(typeof route.params.id === 'string' ? route.params.id : route.params.id[0]);
    } catch (err) {
      console.error('arrivalsStore.selectArrival error:', err)
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

</script>

<template>
  <div class="main_container full-height full-width">
    <div class="column justify-center relative-position q-mb-xl px-40 pt-40">
      <BackButton @click="router.push('/employee-actions')" class="absolute-top-left" />
      <div class="text-h2 text-uppercase text-center mb-100">
        {{ $t('arrival_goods') }}
      </div>

      <div class="row justify-between">
        <div class="text-h3 first_letter">
          {{ $t('received_goods') }}
        </div>
        <div class="text-h4 row q-gutter-x-sm text-weight-regular">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>№{{ arrivalsStore.arrival?.arrivalNumStr }}</span>
        </div>
      </div>
    </div>
    <DividerThin />
      <div class="row px-40">

      </div>
    <DividerThin />

    <div class="scroll_area px-40">
      <div class="arrivals_container">
        <ArrivalItem v-for="arrival in arrivalsStore.arrival?.items"
          :key="arrival.id"
          :good="arrival"
          :confirmed="arrivalsStore.blockScan  === arrival.id"
          :not_equal="arrival.issued !== arrival.quant"
          :class="{ 'highlighted': arrival.confirmed }"
          @itemConfirm="arrival.confirmed = !arrival.confirmed"
          @resetActualQuantity="arrival.issued = 0"
        />
      </div>
    </div>
    <DividerBold class="mb-40" />
    <div class="column pa-40">
      <div class="row justify-between items-center mb-40">
        <div class="text-h3 row">
          <span class="mr-10">{{$t('total')}}</span>
          <span class="mr-10">{{arrivalsStore.arrival?.items.length}}</span>
          <span class="mr-10">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: arrivalsStore.arrival?.items.length}) }}</span>
        </div>

        <div class="text-h3 text-weight-regular row">
          <div class="mr-10">{{$t('estimated_quantity')}}</div>
          <div class="mr-10">{{arrivalsStore.arrival?.totalCount}}</div>
          <div class="mr-10">{{ $t('pc', {count: arrivalsStore.arrival?.totalCount}) }}</div>
          <q-separator color="secondary" vertical class="mr-10" size="0.2rem" />
          <div class="mr-10">{{$t('actual_quantity')}}</div>
          <div class="mr-10">{{ arrivalsStore.totalQuant }}</div>
          <div>{{ $t('pc', {count: arrivalsStore.totalQuant}) }}</div>
        </div>
      </div>
      <div class="full-width buttons_container">
        <RectangularButton :name="$t('print')" :color="'secondary'" size="xl" class="q-pr-sm" @click="printGoodsArrival({documentId: arrivalsStore.arrivalDocument?.id ?? '', $q, appStore})" />
        <RectangularButton
          :name="$t('confirm')"
          class="fit button_style_confirm"
          @click="confirmArrival"
          :disable="!allowConfirm"
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
.arrivals_container {
  padding: 0.5rem;
}

.buttons_container {
  display: grid;
  grid-template-columns: 0.3fr 1fr;
  column-gap: var(--px60);
}

</style>
