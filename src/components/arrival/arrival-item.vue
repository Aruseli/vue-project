<script setup>
  import RoundedButton from '../buttons/rounded-button.vue';
  import IconButton from '../buttons/icon-button.vue';

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
    },
  })

  const emit = defineEmits(['click', 'clear']);
  const click = () => {
    emit('click');
  };

  const clear = () => {
    emit('clear');
  };

</script>

<template>
  <div class="container_style row justify-between items-center">
    <div class="text-h5 col-3">{{ props.good_name }}</div>
      <div class="quat_container flex row items-center">
        <div class="text-body1 text-secondary q-mr-sm-sm q-mr-xs-xs">{{$t('actual_quantity')}}</div>
        <div class="quant_style q-mr-sm-sm q-mr-xs-xs">
          <div
            class="
              text-h5
              q-px-lg-md
              q-px-md-sm
              q-px-sm-xs
            "
          >
            {{props.actual_quantity}}
          </div>
        </div>
        <div class="text-body1">{{ $t('pc', {count: props.actual_quantity}) }}</div>
      </div>
      <div class="flex row justify-end items-center">
        <q-img src="/state.svg" v-show="not_equal" class="q-mr-sm-sm q-mr-xs-xs icon_notequal_style" />
        <RoundedButton size="clamp(0.625rem, 0.4798rem + 0.7262vi, 1.25rem)" @click="click" />
        <IconButton
          icon="delete_forever"
          @click="clear"
          class="q-pa-xs"
          color="transparent"
          textColor="primary"
        />
      </div>
  </div>
</template>

<style scoped>
.container_style {
  box-shadow: var(--box-shadow--product_cart);
  border-radius: var(--border-sm);
  padding: var(--px30);
  transition: all 0.5s ease-in-out;
  @media (max-width: 1300px) {
    padding: 1rem;
  }
}
.quant_style {
  width: max-content;
  box-shadow: inset 0 0 2px 3px rgba(0,0,0,0.25);
  height: max-content;
  font-size: 2.5rem;
  border-radius: 1.5rem
}
.icon_notequal_style {
  width: 3rem;
  @media (max-width: 1300px) {
    width: 1.5rem;
  }
}
</style>
