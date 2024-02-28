<script setup>
  import RoundedButton from '../buttons/rounded-button.vue';

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
    not_equal: {
      type: Boolean,
      required: false,
      default: false,
    },
  })

  const emit = defineEmits(['click']);
  const click = () => {
    emit('click')
  }

</script>

<template>
  <li
    class="list_style relative-position row justify-between items-center"
  >
    <div class="row justify-between items-center fit q-px-sm q-py-xs">
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
      <div class="flex row justify-end items-center q-gutter-lg">
        <q-img src="/state.svg" width="3rem" v-show="not_equal" />
        <RoundedButton size="1.5rem" @click="click" />
      </div>

    </div>
    <q-separator color="secondary" class="absolute-bottom-left full-width separator_style"  />
  </li>
  <!-- <DividerThin class="bg-secondary" /> -->
</template>

<style scoped>
.list_style {
  border-radius: 3rem;
  transition: all 0.5s ease-in-out;
}
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
