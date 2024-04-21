<script setup lang="ts">
  import Bin from '../orders/bin.vue';
  import ModalButton from '../buttons/modal-button.vue';
  import { ref } from 'vue';
  import Modal from '../../overlay/modal.vue';
  import ConfirmButton from '../buttons/confirm-button.vue';

  const switchModal = ref(false);
  const props = defineProps({
    good: {
      type: Object,
      required: true,
    },
    number: {
      type: Number,
    },
    not_equal: {
      type: Boolean,
      required: false,
      default: false,
    },
  })

  const emit = defineEmits(['itemConfirm', 'resetActualQuantity']);

  const resetQuant = () => {
    emit('resetActualQuantity');
    switchModal.value = false;
  };
</script>

<template>
  <div class="container_style row justify-between items-center pa-20" v-bind="$attrs">
    <div class="row items-center">
      <Bin @click="switchModal = true" />
      <div class="text-h4 text-weight-regular">{{ props.number }}.</div>
    </div>
    <div class="text-h4 col-3 text-weight-regular">{{ props.good.title }}</div>

    <!-- estimated quantity -->
    <div class="text-h4 px-40 text-weight-regular">
      {{props.good.quant}}
    </div>

    <!-- actual quantity -->
    <div class="text-h4 px-40 text-weight-regular">
      {{props.good.issued}}
    </div>

    <div class="flex no-wrap justify-end items-center">
      <q-img src="/state.svg" v-show="props.not_equal" class="mr-10 icon_notequal_style" />
      <ConfirmButton @click="emit('itemConfirm')" />
    </div>
  </div>
  <Modal :isOpen="switchModal" class="bg-white">
    <div class="text-h2 mb-30 text-center">{{ $t('are_you_sure_you_want_to_rescan_the_product') }} <span class="text-italic">{{ props.good.title }} ?</span></div>

    <div class="buttons_container">
      <ModalButton :name="$t('no')" color="transparent" class="pa-20" @click="switchModal = false" textColor="primary" />
      <ModalButton :name="$t('yes')" class="pa-20" @click="resetQuant" />
    </div>
  </Modal>
</template>

<style scoped>
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
}
.buttons_container {
  display: grid;
  grid-template-columns: repeat(2, 0.5fr);
  column-gap: var(--px60);
}
</style>
