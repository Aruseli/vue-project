<script setup>
  import { t } from 'i18next';
  import RoundedButton from '../buttons/rounded-button.vue';
  import { reactive, computed } from 'vue';

  const props = defineProps({
    good_name: {
      type: String,
      required: false,
      default: 'Product name'
    },
    estimated_quantity: {
      type: Number,
      required: false,
      default: 10,
    },
    actual_quantity: {
      type: Number,
      required: false,
      default: 0,
    },
  })

  let state = reactive({
    good_name: props.good_name,
    estimated_quantity: props.estimated_quantity,
    actual_quantity: 12,
  });

  const not_equal = computed(() => {
    return state.estimated_quantity!== state.actual_quantity;
  })

  const sendData = () => {
    console.log(state.actual_quantity);
  }
</script>

<template>
  <div class="row justify-between items-center container_style">
    <div class="text-h4 col-3">{{ props.good_name }}</div>
    <q-input
      outlined rounded
      :v-model.number="state.actual_quantity"
      type="number"
      :dark="false" class="text-txt"
      input-class="input_style"
    >
      <template v-slot:before>
        <span class="text-txt text-secondary">{{t('actual_quantity')}}</span>
      </template>

      <template v-slot:after>
        <span class="text-txt">{{ t('pcs') }}</span>
      </template>
    </q-input>
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

</style>
