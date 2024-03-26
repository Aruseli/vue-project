<script setup>
  import i18next from 'i18next';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useArrivalsStore } from 'src/stores/arrivals';
import { useGoodsStore } from 'src/stores/goods';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RectangularButton from '../buttons/rectangular-button.vue';
import DividerBold from '../dividers/divider-bold.vue';
import ArrivalItem from './arrival-item.vue';

const goodsStore = useGoodsStore();

  const $q = useQuasar();

  const arrivalsStore = useArrivalsStore();
  const router = useRouter();
  const route = useRoute();

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
      await arrivalsStore.selectArrival(route.params.id);
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
    <div class="relative-position q-mb-lg-xl q-mb-xs-sm">
      <RectangularButton :name="$t('back_to_employee_actions')" color="secondary" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/employee-actions')" />

      <div
        class="
          text-h2
          text-uppercase text-center
          q-mb-lg-lg
          q-mb-xs-sm
          q-pt-sm-sm
          q-pt-xs-sm
        "
      >{{ $t('arrival_goods') }}</div>

      <div
        class="
          row justify-between
          q-mb-md-sm
          q-mb-xs-sm
        "
      >
        <div class="text-h5 text-capitalize">
          {{ $t('received_goods') }}
        </div>
        <div class="text-h5 row q-gutter-x-sm">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>№{{ arrivalsStore.arrival?.arrivalNumStr }}</span>
        </div>
      </div>
      <DividerBold />
    </div>

    <div class="scroll_area">
      <div class="arrivals_container">
        <ArrivalItem v-for="arrival in arrivalsStore.arrival?.items"
          :key="arrival.id"
          :good_name="arrival.title"
          :actual_quantity="arrival.issued"
          :confirmed="arrivalsStore.blockScan  === arrival.id"
          :not_equal="arrival.issued !== arrival.quant"
          :class="{ 'highlighted': arrival.confirmed }"
          @itemConfirm="arrival.confirmed = !arrival.confirmed"
          @resetActualQuantity="arrival.issued = 0"
          :id="arrival.id"
        />
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
        <div class="text-h5 row">
          <span class="q-mr-xs-xs">{{$t('total')}}</span>
          <span class="q-mr-xs-xs">{{arrivalsStore.arrival?.items.length}}</span>
          <span class="q-mr-xs-xs">{{ $t('product') }}</span>
          <span>{{ $t('units', {count: arrivalsStore.arrival?.items.length}) }}</span>
        </div>

        <div class="text-h5 text-weight-regular row">
          <div class="q-mr-xs-xs">{{$t('estimated_quantity')}}</div>
          <div class="q-mr-xs-xs">{{arrivalsStore.arrival?.totalCount}}</div>
          <div class="q-mr-xs-xs">{{ $t('pc', {count: arrivalsStore.arrival?.totalCount}) }}</div>
          <q-separator color="secondary" vertical class="q-mr-xs-xs" size="0.2rem" />
          <div class="q-mr-xs-xs">{{$t('actual_quantity')}}</div>
          <div class="q-mr-xs-xs">{{ arrivalsStore.totalQuant }}</div>
          <div>{{ $t('pc', {count: arrivalsStore.totalQuant}) }}</div>
        </div>
      </div>
      <div class="full-width">
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

</style>
