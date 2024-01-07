<script setup>
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { useOrderStore } from 'src/stores/order';
import DividerBold from 'src/components/dividers/divider-bold.vue';
import DividerThin from 'src/components/dividers/divider-thin.vue';
import RectangularButton from 'src/components/buttons/rectangular-button.vue';

  const orderStore = useOrderStore();
  const router = useRouter();
  const { t } = useI18n();

  const goToOrderedList = () => {
    router.push('/issuing-order');
  }
  const goToEmployeeActions = () => {
    router.push('/employee-actions');
  }

</script>

<template>
  <q-page class="flex flex-center relative transparent">
    <div class="column justify-center items-center window-height full-width container">
      <div as="h1" class="text-h1 text-uppercase text-center title_style">{{ t('order_was_issued_successfully') }}</div>
      <q-img src="src/assets/checked.svg" class="image_style" max-width="100%" max-height="100%" width="25rem" height="25rem" />
      <DividerBold class="divider_bold_style" />
      <div class="column items-center full-width q-mb-xl">
        <div class="q-mb-md row justify-between items-center full-width">
          <div class="text-h2">{{t('total')}}</div>
          <div class="text-h2">
            {{ orderStore.orders[0].totalCost }} &ensp;&#3647
          </div>
        </div>
        <DividerThin class="bg-negative q-mb-md" />
        <div class="text-h2 order_container text-weight-regular self-start">
          <span>{{t('order')}}</span>&ensp;
          <span>{{ orderStore.orders[0].totalCount }}</span>&ensp;
          <span>{{ t('product_units') }}</span>
        </div>
      </div>
      <div class="column justify-center full-width ">
        <RectangularButton
          :name="t('back_to_order_list')"
          @click="goToOrderedList"
          class="q-mb-xl"
        />
        <RectangularButton
          :name="t('back_to_employee_actions')"
          @click="goToEmployeeActions"
        />
      </div>
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}

.container > *:nth-child(-n+2) {
  margin-bottom: var(--px90);
}

.title_style {
  padding: 0 5rem;
}
.divider_bold_style {
  margin-bottom: var(--px64);
}
</style>
