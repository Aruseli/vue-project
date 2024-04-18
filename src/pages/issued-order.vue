<script setup>
  import { useRouter } from 'vue-router';
  import { useOrdersStore } from 'src/stores/orders';
  import DividerBold from 'src/components/dividers/divider-bold.vue';
  import DividerThin from 'src/components/dividers/divider-thin.vue';
  import RectangularButton from 'src/components/buttons/rectangular-button.vue';

  const ordersStore = useOrdersStore();
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
    <div class="column justify-center items-center full-height full-width container">
      <div class="text-h2 text-center title_style first_letter">{{ $t('order_was_issued_successfully') }}</div>
      <q-img src="/checked.svg" class="img_style" max-width="100%" max-height="100%" />
      <DividerBold class="divider_bold_style" />
      <div class="column items-center full-width q-mb-lg-lg q-mb-xs-sm">
        <div class="q-mb-lg-lg q-mb-xs-sm row justify-between items-center full-width">
          <div class="text-h3">{{$t('total')}}</div>
          <div class="text-h3">
            {{ ordersStore.currentOrder.totalPrice }} &ensp;&#3647
          </div>
        </div>
        <DividerThin class="bg-negative q-mb-lg-md q-mb-xs-sm" />
        <div class="text-h3 row q-gutter-x-sm text-weight-regular self-start">
          <span>{{$t('order')}}</span>&ensp;
          <span>{{ ordersStore.currentOrder.totalCount }}</span>&ensp;
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', {count: ordersStore.currentOrder.totalCount}) }}</span>
        </div>
      </div>
      <div class="column justify-center full-width">
        <RectangularButton
          :name="$t('back_to_order_list')"
          @click="goToOrderedList"
          class="q-mb-lg-xl q-mb-xs-sm button_style_confirm"
          />
          <RectangularButton
          :name="$t('back_to_employee_actions')"
          @click="goToEmployeeActions"
          class="button_style_confirm"
        />
      </div>
    </div>
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
