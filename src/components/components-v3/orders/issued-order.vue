<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useOrdersStore } from '../../../stores/orders';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import LogoSvg from 'src/components/logo/logo-svg.vue';

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
  <div class="column items-center window-height full-width container">
    <div class="column mb-90 mt-140 text-h1 text-center text-uppercase line_height_1_3">
      <div>{{ $t('the_order') }}</div>
      <div>№{{ ordersStore.currentOrder?.orderNumStr }}</div>
      <div>{{ $t('was_issued_successfully') }}</div>
    </div>
    <div class="logo_container">
      <LogoSvg class="mb-90" />
    </div>

    <div class="column mb-90 full-width px-100">
      <div class="column mb-90 full-width total_container px-40 py-20">
        <div class="text-h3 row q-gutter-x-sm text-weight-bold mb-10">
          <span class>{{ $t('order') }}</span>
          <span>{{ ordersStore.currentOrder?.totalCount }}</span>
          <span>{{ $t('product') }}</span>
          <span>{{ $t('units', { count: ordersStore.currentOrder?.totalCount }) }}</span>
        </div>
        <div class="row justify-between text-h2 text-uppercase">
          <div class="q-mr-sm">{{ $t('total') }}</div>
          <div> {{ ordersStore.currentOrder?.totalPrice }}&ensp;&#3647;</div>
        </div>
      </div>
    </div>
    <div class="full-width px-140">
      <ol class=" text-grey full-width">
        <li
          class="text-h4 text-weight-light mb-10"
          v-for="item in ordersStore.currentOrder?.items"
          :key="item.id"
        >
          <div class="ordered_list">
            <div>{{ item.title }}</div>
            <div class="dotted_border" />
            <div>
              <span>{{ item.quant }}</span>
              <span>{{ $t('pc', { count: item.quant }) }}</span>
            </div>
            <div class="dotted_border" />
            <div>{{ item.price * item.quant }}&ensp;&#3647</div>
          </div>
        </li>
      </ol>
    </div>
    <div class="buttons_class justify-center full-width mb-140 px-140">
      <RectangularButton
        :name="$t('open_orders')"
        @click="goToOrderedList"
      />
        <RectangularButton
        :name="$t('main_menu')"
        @click="goToEmployeeActions"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-rows: repeat(3, max-content) 1fr max-content;
  background-color: white;
  justify-items: center;
}
.logo_container {
  width: 15rem;
}
.total_container {
  box-shadow: var(--border-shadow);
  border-radius: var(--border-xxs);

}
.ordered_list {
  display: grid;
  grid-template-columns: max-content 1fr max-content 1fr max-content;
}

.buttons_class {
  display: grid;
  grid-template-columns: repeat(2, 0.5fr);
  column-gap: 3rem;
}

</style>
