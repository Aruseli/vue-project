<script setup lang="ts">
import RectangularButton from '../buttons/rectangular-button.vue';
import Modal from '../overlay/modal.vue';

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
  additionalCartStyle: {
    type: String,
    required: false,
    default: '',
  },
  titleClass: {
    type: String,
    required: false,
    default: '',
  },
  mode: {
    type: String,
    default: 'dark'
  }
})

</script>

<template>
  <Modal
    :isOpen="props.modelValue"
    to="#redirect-dialog"
    bgModalStyle="z-index: 9999"
    contentBlockStyle="z-index: 99999"
  >
    <div
      class="dialog_style overflow-hidden"
      role="dialog"
      aria-modal="true"
      :class="props.mode == 'dark' ?  'bg-grey-3 text-white' : 'bg-white'"
    >
      <div
        class="text-h3 text-center px-60 pt-60 text_container text-uppercase"
        :class="props.titleClass"
      >
        {{ $t(props.title) }}
      </div>
      <slot name="content"></slot>
      <div class="buttons_container pa-30">
        <slot name="actions"></slot>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.bg_modal_class {
  z-index: 9999;
}
.dialog_style {
  border-radius: var(--border-xxs);
  width: 48rem;
  min-height: 22rem;
  display: grid;
  grid-template-rows: 1fr repeat(2, max-content);
  align-items: center;
}

.text_container {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.buttons_container {
  display: grid;
  align-content: center;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 20rem));
  column-gap: var(--px30);
}

</style>
