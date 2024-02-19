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
  <li class="list_item relative-position">
    <div class="row justify-between items-center">
      <div class="text-h4 col-3">{{ props.good_name }}</div>
      <div class="text-txt col-3">
        <span class="text-txt">{{$t('estimated_quantity')}}</span>&ensp;
        {{ props.estimated_quantity }}&ensp;{{ $t('pc') }}
      </div>
      <div class="quat_container flex row items-center q-gutter-lg">
        <div class="text-txt text-secondary">{{$t('actual_quantity')}}</div>
        <div class="quant_style">
          <div class="text-h4 q-px-md">
            {{props.actual_quantity}}
          </div>
        </div>
        <div class="text-txt">{{ $t('pc', {count: props.actual_quantity}) }}</div>
      </div>
      <RoundedButton size="1.5rem" @click="sendData" />
      <q-img src="/state.svg" width="3rem" v-show="not_equal" />
    </div>
    <q-separator color="secondary" class="absolute-bottom-left full-width separator_style"  />
  </li>
  <!-- <DividerThin class="bg-secondary" /> -->
</template>

<style scoped>
.separator_style {
  bottom: -0.9rem;
}
.quant_style {
  width: max-content;
  box-shadow: inset 0 0 2px 3px rgba(0,0,0,0.25);
  height: max-content;
  font-size: 2.5rem;
  border-radius: 1.5rem
}
</style>
