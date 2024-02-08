<script setup>
  import RoundedButton from '../buttons/rounded-button.vue';
  import { reactive, computed } from 'vue';

  const props = defineProps({
    good_name: {
      type: String,
      required: false,
      default: 'Product name'
    },
    actual_quantity: {
      type: Number,
      required: false,
      default: 0,
    },
    not_equal: {
      type: Boolean,
      required: false,
      default: false,
    }
  })

  const sendData = () => {
    console.log(state.actual_quantity);
  }
</script>

<template>
  <div class="row justify-between items-center container_style">
    <div class="text-h4 col-3">{{ props.good_name }}</div>
      <div class="quat_container flex row items-center q-gutter-lg">
        <div class="text-txt text-secondary">{{$t('actual_quantity')}}</div>
        <div class="quant_style">
          <div class="text-h4 q-px-md">
            {{props.actual_quantity}}
          </div>
        </div>
        <div class="text-txt">{{ $t('pc', {count: props.actual_quantity}) }}</div>
      </div>

    <RoundedButton size="1.5rem" @click="" />
    <q-img src="/state.svg" width="3rem" v-show="not_equal" />
  </div>
</template>

<style scoped>
.container_style {
  box-shadow: var(--box-shadow--product_cart);
  border-radius: var(--border-sm);
  padding: var(--px30);
}
.quant_style {
  width: max-content;
  box-shadow: inset 0 0 2px 3px rgba(0,0,0,0.25);
  height: max-content;
  font-size: 2.5rem;
  border-radius: 1.5rem
}

</style>
