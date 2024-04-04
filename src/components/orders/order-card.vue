<script setup>

  const props = defineProps({
    good_id: {
      type: Number,
      required: false,
    },
    good_title: {
      type: String,
      required: false,
      default: 'product name'
    },
    good_price: {
      type: Number,
      required: false,
      default: 999,
    },
    good_quant: {
      type: Number,
      required: false,
      default: 0,
    },
    good_issued: {
      type: Number,
      required: false,
      default: 0,
    },
    good_src: {
      type: String,
      required: false,
      default: 'src/assets/smoke.jpeg'
    },
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }
</script>

<template>
  <div
    :class="'cart_product_item row ' + (props.good_issued != props.good_quant ? 'bg-white' : 'bg-positive')"
    v-bind="$attrs"
    @click="click">
    <div class="col-3 q-pr-lg-md q-pr-xs-sm">
      <q-img
        :src="props.good_src"
        ration="4/3"
        class="img_style"
        fit="unset"
      >
        <template #loading>
          <div class="text-subtitle1 text-black">
            Loading...
          </div>
        </template>
      </q-img>
    </div>
    <div class="column justify-between col-9">
      <div class="row justify-between items-center">
        <div class="text-h3 text-weight-regular">
          {{ props.good_title }}
        </div>
      </div>
      <div class="row justify-between items-center">
        <div class="text-h3">
          &#3647&ensp;{{ props.good_price }}
        </div>
        <div class="text-h3 row q-gutter-x-sm">
          <span>{{ props.good_issued > 0 ? props.good_issued + ' / ' : '' }}</span>
          <span>{{ props.good_quant }}</span>
          <span>{{ $t('pc', {count: props.good_quant}) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart_product_item {
    width: 100%;
    height: max-content;
    justify-content: space-between;
    border-radius: var(--border-sm);
    box-shadow: var(--box-shadow--product_cart);
    padding: var(--px20);
    @media (max-width: 1300px) {
      padding: 1rem;
    }
  }

  .img_style {
    height: 15rem;
    @media (max-width: 1300px) {
      height: 7rem;
    }
  }
</style>
