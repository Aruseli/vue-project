<script setup>
  import RoundedButton from '../buttons/rounded-button.vue';
  import IconButton from '../buttons/icon-button.vue';
  import RectangularButton from '../buttons/rectangular-button.vue';
  import { ref } from 'vue';
  import Modal from '../overlay/modal.vue';

  const switchModal = ref(false);
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
    id: {
      type: String,
      required: false,
      default: '',
    },
  })

  const emit = defineEmits(['itemConfirm', 'resetActualQuantity']);

  const resetQuant = () => {
    emit('resetActualQuantity');
    switchModal.value = false;
  };
</script>

<template>
  <li class="list_style relative-position row justify-between items-center q-py-sm">
    <div class="row justify-between items-center fit q-py-xs content_block" v-bind="$attrs">
      <div class="text-h3 col-md-3">{{ props.good_name }}</div>
      <div class="text-body1 col-md-3">
        <span class="text-body1">{{$t('estimated_quantity')}}</span>&ensp;
        {{ props.estimated_quantity }}&ensp;{{ $t('pc', {count: props.estimated_quantity}) }}
      </div>
      <div class="flex row items-center">
        <div class="text-body1 text-secondary q-mr-sm-sm q-mr-xs-xs">{{$t('actual_quantity')}}</div>
        <div class="quant_style q-mr-sm-sm q-mr-xs-xs">
          <div
            class="
              text-h3
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
        <q-img src="/state.svg" v-show="props.not_equal" class="q-mr-sm-sm q-mr-xs-xs icon_notequal_style" />
        <RoundedButton size="clamp(0.625rem, 0.4798rem + 0.7262vi, 1.25rem)" @click="emit('itemConfirm')" />
        <IconButton
          icon="delete_forever"
          @click="switchModal = true"
          class="q-pa-xs"
          color="transparent"
          textColor="primary"
          :disable="props.actual_quantity == 0"
        />
      </div>
    </div>
    <q-separator class="absolute-bottom-left full-width separator_style" />
  </li>
  <Modal :isOpen="switchModal" class="bg-white">
    <div class="text-h3 q-mb-md-md q-mb-xs-sm text-center">{{ $t('are_you_sure_you_want_to_rescan_the_product') }} <span class="text-italic">{{ props.good_name }} ?</span></div>

    <div class="row justify-evenly items-center">
      <RectangularButton :name="$t('no')" color="transparent" class="q-px-xs-sm q-py-md-sm q-py-xs-xs col-3" @click="switchModal = false" textColor="primary" />
      <RectangularButton :name="$t('yes')" class="q-px-md-sm q-px-xs-sm q-py-md-sm q-py-xs-xs col-3" @click="resetQuant" />
    </div>
  </Modal>
</template>

<style scoped>
.list_style {
  transition: all 0.5s ease-in-out;
}
.content_block {
  padding-left: 1.5rem;
  padding-right: 10px;
}
.separator_style {
  bottom: 0;
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
