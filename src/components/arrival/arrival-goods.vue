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

  const not_equal = arrivalsStore.arrival?.items.find(i => i.quant !== i.issued)
</script>

<template>
  <div class="main_container full-height full-width">
    <div class="relative-position q-mb-xl">
      <RectangularButton :name="$t('back_to_employee_actions')" :color="'secondary'" size="xl" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/employee-actions')" />

      <div class="text-h2 text-uppercase text-center q-mb-xl title_padding">{{ $t('arrival_goods') }}</div>

      <div class="row justify-between q-mb-md">
        <div class="text-h3 text-capitalize">
          {{ $t('received_goods') }}
        </div>
        <div class="text-h3 row q-gutter-md">
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
          :actual_quantity="arrival.issued == 0 ? 0 : arrival.issued"
          :not_equal="arrival.issued !== arrival.quant"
        />
      </div>
    </div>
    <div>
      <DividerBold class="q-mb-lg" />
      <div class="row justify-between items-center q-mb-xl">
        <div class="text-h4 row q-gutter-sm">
          <span>{{$t('total')}}</span>
          <span>{{arrivalsStore.arrival?.items.length}}</span>
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', {count: arrivalsStore.arrival?.items.length}) }}</span>
        </div>

        <div class="text-h4 text-weight-regular row q-gutter-sm">
          <div>{{$t('estimated_quantity')}}</div>
          <div>{{arrivalsStore.arrival?.totalCount}}</div>
          <div>{{ $t('pc', {count: arrivalsStore.arrival?.totalCount}) }}</div>
          <q-separator color="secondary" vertical spaced="lg" size="0.2rem" />
          <div>{{$t('actual_quantity')}}</div>
          <div>{{ arrivalsStore.totalQuant }}</div>
          <div>{{ $t('pc', {count: arrivalsStore.totalQuant}) }}</div>
        </div>
      </div>
      <div class="full-width">
        <RectangularButton
          :name="$t('confirm')"
          class="fit"
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

ol li {
  margin-bottom: 2.5rem;
}
.arrivals_container > *:not(:last-child) {
  margin-bottom: 2rem;
}

</style>
