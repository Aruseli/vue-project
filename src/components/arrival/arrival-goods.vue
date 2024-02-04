<script setup>
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import DividerBold from '../dividers/divider-bold.vue';
  import ArrivalItem from './arrival-item.vue';
  import moment from 'moment';
  import axios from 'axios';
  import { useGoodsStore } from 'src/stores/goods';

  const router = useRouter();
  const goodsStore = useGoodsStore();

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

  const formattedTime = ref(null);

  // const watchID = navigator.geolocation.watchPosition((position) => {
  //   console.log('get', position.coords.latitude, position.coords.longitude);
  // });
  navigator.geolocation.getCurrentPosition((position) => {
    console.log('watch', position.coords.latitude, position.coords.longitude);
    const timeZoneURL = `http://api.timezonedb.com/v2.1/get-time-zone?key=KJCIM2OH09TJ&format=xml&by=position&lat=${position.coords.latitude}&lng=${position.coords.longitude}`

    axios
      .get(timeZoneURL)
      .then(response => {
        const data = response.data;
        const timeZone = data.zoneName;
        formattedTime.value = moment(timeZone).format('LT').slice(0, -3);

        console.log(`Текущее время по вашей геолокации (${timeZone}): ${formattedTime.value}`);
      })
      .catch(error => {
        console.error('Произошла ошибка:', error);
      });
  });



  // Get the current date
  const date = new Date();
  // Format the date using Moment.js
  const formattedDate = moment(date).format('DD.MM.YY');
  // Output the formatted date
  console.log(formattedDate); // Output: 04.02.24

</script>

<template>
  <div class="main_container full-height full-width">
    <div class="relative-position q-mb-xl">
      <RectangularButton :name="$t('back_to_employee_actions')" :color="'secondary'" size="xl" icon="arrow_back_ios_new" class="q-pr-sm" @click="router.push('/employee-actions')" />

      <div class="text-h2 text-uppercase text-center q-mb-xl title_padding">{{ $t('arrival_goods') }}</div>

      <div class="row justify-between q-mb-md">
        <div class="text-h3 text-capitalize">
          {{ $t('remaining_goods') }}
        </div>
        <div class="text-h3 row q-gutter-md">
          <span>{{ formattedDate }}</span>
          <span>{{ formattedTime }}</span>
          <span>{{ '№0000087' }}</span>
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
          <span>{{$t('total')}}</span>
          <span>{{items.length}}</span>
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', {count: items.length}) }}</span>
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
      <div class="full-width">
        <RectangularButton
          :name="$t('confirm')"
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

.router_link_style {
  font-size: 3rem;
  text-decoration: none;
}
ol li {
  margin-bottom: 2.5rem;
}

</style>
