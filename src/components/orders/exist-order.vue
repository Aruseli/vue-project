<script setup>
  import DividerThin from '../dividers/divider-thin.vue';

  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const router = useRouter();
  const { t } = useI18n();

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }

  const props = defineProps({
    good_price: {
      type: Number,
      required: true,
    },
    good_title: {
      type: String,
      required: false,
    },
    order_number: {
      type: String,
      required: false
    },
    good_id: {
      type: String,
      required: false
    },
  })
</script>

<template>
  <div class="cart_product_item column justify-between bg-white" @click="click">
    <div class="row justify-between items-center">
      <div class="text-h3">
        №{{ props.order_number }}
      </div>
      <div class="text-h3">
        &#3647&ensp;{{ props.good_price }}
      </div>
    </div>
    <DividerThin class="q-mb-none bg-negative" />
    <div class="row justify-start items-center">
      <div class="text-h3 text-weight-regular">
        {{ props.good_title }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 5rem;
}
.cart_product_item {
  width: 100%;
  height: max-content;
  border-radius: var(--border-sm);
  box-shadow: var(--box-shadow--product_cart);
  padding: var(--px20);
}
.cart_product_item > *:not(:last-child) {
  margin-bottom: 1.5rem;
}
</style>
