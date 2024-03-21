<script setup>
  import RoundedButton from '../buttons/rounded-button.vue';
  import IconButton from '../buttons/icon-button.vue';
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

  const emit = defineEmits(['click', 'clear']);
  const click = () => {
    emit('click');
  };

  const clear = () => {
    emit('clear');
  };

</script>

<template>
  <li class="list_style relative-position row justify-between items-center">
    <div class="row justify-between items-center fit q-py-xs content_block">
      <div class="text-h5 col-md-3">{{ props.good_name }}</div>
      <div class="text-body1 col-md-3">
        <span class="text-body1">{{$t('estimated_quantity')}}</span>&ensp;
        {{ props.estimated_quantity }}&ensp;{{ $t('pc', {count: props.estimated_quantity}) }}
      </div>
      <div class="flex row items-center">
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
    <q-separator class="absolute-bottom-left full-width separator_style" />
  </li>
</template>

<style scoped>
.list_style {
  border-radius: 3rem;
  transition: all 0.5s ease-in-out;
}
.content_block {
  padding-left: 10px;
  padding-right: 10px;
}
.separator_style {
  bottom: -0.9rem;
  background-color: var(--q-secondary);
  @media (max-width: 1300px) {
    background-color: var(--q-negative);
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
