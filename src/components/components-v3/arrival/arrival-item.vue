<script setup lang="ts">
  import Bin from '../orders/bin.vue';
  import ModalButton from '../buttons/modal-button.vue';
  import { ref } from 'vue';
  import Modal from '../../overlay/modal.vue';

  const switchModal = ref(false);
  const props = defineProps({
    good_title: {
      type: String,
      required: true,
    },
    good_stock: {
      type: Number,
      required: true,
    },
    good_quant: {
      type: Number,
      required: true,
    },
    good_number: {
      type: Number,
      required: true,
    },
  })

  const emit = defineEmits(['itemConfirm', 'resetActualQuantity']);

  const resetQuant = () => {
    emit('resetActualQuantity');
    switchModal.value = false;
  };
</script>

<template>
  <div class="container_style row justify-between items-center pa-5" v-bind="$attrs">
    <div class="row items-center">
      <Bin @click="emit('resetActualQuantity')" />
      <div class="text-h4 text-weight-regular">{{ props.good_number }}.</div>
    </div>
    <div class="text-h4 col-3 text-weight-regular">{{ props.good_title }}</div>

    <!-- estimated quantity -->
    <div class="text-h4 px-40 text-weight-regular">
      {{props.good_stock}}
    </div>

    <!-- actual quantity -->
    <div class="text-h4 px-40 text-weight-regular">
      {{props.good_quant}}
    </div>
    <div class="flex no-wrap justify-end items-center relative-position">
      <q-img src="/state.svg" v-show="props.good_stock !== props.good_quant" class="mr-10 icon_notequal_style" />
      <q-img src="/state.svg" class="mr-10 icon_notequal_style__opacity" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container_style {
  box-shadow: var(--border-shadow);
  border-radius: var(--border-xxs);
  transition: all 0.5s ease-in-out;
  margin-bottom: 1.5rem;
}

.icon_notequal_style {
  width: 3rem;
  @media (max-width: 1300px) {
    width: 1.5rem;
  }
  &__opacity {
    opacity: 0;
    position: absolute;
  }
}
.buttons_container {
  display: grid;
  grid-template-columns: repeat(2, 0.5fr);
  column-gap: var(--px60);
}
</style>
