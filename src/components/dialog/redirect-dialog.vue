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
  }
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
          <div class="text-h3 q-mb-sm">{{ $t('are_you_here') }}</div>
          <div class="text-h5">{{$t('buying_session_will_end_in')}} <span>{{ props.timer }}</span>&ensp;{{ $t('seconds', {count: props.timer}) }}</div>
        </q-card-section>

        <q-card-section class="row items-center justify-center q-gutter-md">
          <RectangularButton :name="$t('complete')" color="'transparent'" size="lg" class="q-px-xl" @click="emit('complete')" textColor="primary" />
          <RectangularButton :name="$t('continue')" size="lg" class="q-px-xl" @click="emit('continue')" />
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
