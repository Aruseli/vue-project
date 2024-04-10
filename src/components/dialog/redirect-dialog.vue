<script setup>
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
})

</script>

<template>
  <Modal :isOpen="props.modelValue" to="#redirect-dialog">
    <div class="card_container">
      <q-card class="q-pa-sm fit card_style">
        <q-card-section class="row items-center justify-end" />
        <q-card-section class="column items-center q-mb-xs-sm">
          <div class="text-h3 q-mb-sm-sm q-mb-xs-xs text-center title_style">{{ $t(props.title) }}</div>
          <slot name="content"></slot>
        </q-card-section>

        <q-card-section class="row items-center justify-evenly">
          <slot name="actions"></slot>
        </q-card-section>

      </q-card>
    </div>
  </Modal>
</template>

<style>
.card_container {
  width: 50vw;
  height: max-content;
  @media (max-width: 899px) {
    width: 90vw;
  }
}

.card_style {
  border-radius: 2rem;
}
.title_style {
  text-transform: none;
  @media (max-width: 899px) {
    text-transform: uppercase;
  }
}
</style>
