<script setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
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
      default: 1
    },
    good_src: {
      type: String,
      required: false,
      default: 'src/assets/smoke.jpeg'
    },
    scannedItem: {
      type: Boolean,
      required: false,
      default: false,

    }
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }
</script>

<template>
  <div
    class="cart_product_item row bg-white"
    v-bind="$attrs"
    @click="click">
    <div class="col-3 q-pr-lg">
      <q-img
        :src="props.good_src"
        ration="4/3"
        height="15rem"
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
        <div class="text-h2 text-weight-regular">
          {{ props.good_title }}
        </div>
      </div>
      <div class="row justify-between items-center">
        <div class="text-h2">
          &#3647&ensp;{{ props.good_price }}
        </div>
        <div class="text-h3">{{ props.good_quant }}{{ t('pcs') }}</div>
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
  }
</style>
