<script setup>
import Modal from '../../overlay/modal.vue';

const emit = defineEmits(['complete', 'continue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: false,
    default: 'are_you_here',
  },
})

</script>

<template>
  <Modal :isOpen="props.modelValue" to="#redirect-dialog">
    <div class="modal_container column pa-40 bg-white">
      <div class="column">
        <div class="text-h2 text-center text-uppercase">{{ $t(props.title) }}</div>
        <slot name="content"></slot>
      </div>
      <div class="buttons_class justify-center full-width">
        <slot name="actions"></slot>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.modal_container {
  width: 50vw;
  border-radius: var(--border-xxs);
  height: max-content;
  @media (max-width: 899px) {
    width: 90vw;
  }
}
.buttons_class {
  display: grid;
  grid-template-columns: repeat(2, 0.5fr);
  column-gap: 2rem;
}

</style>
