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
        <q-card-section class="row items-center justify-end">

        </q-card-section>
        <q-card-section class="column items-center q-mb-md">
          <div class="text-h3 q-mb-sm text-center">{{ $t(props.title) }}</div>
          <slot></slot>
        </q-card-section>

        <q-card-section class="row items-center justify-center q-gutter-md">
          <RectangularButton :name="$t(props.nameLeftButton)" color="'transparent'" size="lg" class="q-px-xl" @click="emit('complete')" textColor="primary" />
          <RectangularButton :name="$t(props.nameRightButton)" size="lg" class="q-px-xl" @click="emit('continue')" />
        </q-card-section>

      </q-card>
    </div>
  </q-dialog>
</template>

<style>
.card_container {
  width: 60vw;
  max-width: 80vw;
  height: max-content;
}
</style>
