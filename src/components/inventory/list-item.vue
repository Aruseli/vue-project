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
      <q-input
        outlined rounded
        :v-model.number="state.actual_quantity"
        type="number"
        :dark="false" class="text-txt"
        input-class="input_style"
      >
        <template v-slot:before>
          <span class="text-txt text-secondary">{{$t('actual_quantity')}}</span>
        </template>

        <template v-slot:after>
          <span class="text-txt">{{ $t('pc') }}</span>
        </template>
      </q-input>
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
</style>
