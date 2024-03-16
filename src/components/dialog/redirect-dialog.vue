<script setup>
import RectangularButton from '../buttons/rectangular-button.vue';


const emit = defineEmits(['complete', 'continue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  timer: {
    type: Number,
    required: false,
    default: 10,
  },
  nameLeftButton: {
    type: String,
    required: false,
    default: 'complete',
  },
  nameRightButton: {
    type: String,
    required: false,
    default: 'continue',
  },
  title: {
    type: String,
    required: false,
    default: 'are_you_here',
  },
})

</script>

<template>
  <q-dialog
    v-model="props.modelValue"
  >
    <div class="card_container">
      <q-card class="q-pa-sm">
        <q-card-section class="row items-center justify-end" />
        <q-card-section class="column items-center q-mb-xs-sm">
          <div class="text-h3 q-mb-sm-sm q-mb-xs-xs text-center title_style">{{ $t(props.title) }}</div>
          <slot></slot>
        </q-card-section>

        <q-card-section class="row items-center justify-evenly">
          <RectangularButton :name="$t(props.nameLeftButton)" color="transparent" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="emit('complete')" textColor="primary" />
          <RectangularButton :name="$t(props.nameRightButton)" class="q-px-md-sm q-px-xs-sm q-py-xs-xs" @click="emit('continue')" />
        </q-card-section>

      </q-card>
    </div>
  </q-dialog>
</template>

<style>
.card_container {
  width: 70vw;
  max-width: 80vw;
  height: max-content;
  @media (max-width: 899px) {
    width: 90vw;
  }
}
.title_style {
  text-transform: none;
  @media (max-width: 899px) {
    text-transform: uppercase;
  }
}
</style>
