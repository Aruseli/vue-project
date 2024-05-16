<script setup lang="ts">
import { PropType } from 'vue';
import RectangularButton from '../buttons/rectangular-button.vue';
import Logo from '../logo/logo.vue';
import LogoSvg from '../logo/logo-svg.vue';
import { Button } from '../components-v3/employee-actions.vue';

const props = defineProps({
  buttons: {
    type: Array as PropType<Button[]>,
    default: []
  },
})
const emit = defineEmits(['click'])
</script>

<template>
  <div class="column justify-center items-center full-height full-width container">
    <Logo class="logo_column" classes="q-mb-md-sm q-mb-xs-xs">
      <LogoSvg fill="#FAFAFA" />
    </Logo>
    <RectangularButton
      v-for="(button, index) in props.buttons"
      :key="index"
      :name='$t(button.name)'
      :disable='button.disable'
      class="button_style"
      :class="{ 'blocked': button.disable }"
      @click="button.click"
    >
      <div v-if="button.badge == true" class="badge_style bg-positive flex items-center justify-center">
        <div class="text-white text-h3">{{ button.badge_text }}</div>
      </div>
    </RectangularButton>

  </div>
</template>

<style scoped>
.container {
  padding: 4rem;
  @media (max-width: 899px) {
    padding: 2rem;
  }
}
.container > *:not(:last-child) {
  margin-bottom: 2rem;
}
.container > *:first-child {
  margin-bottom: 7rem;
  @media (max-width: 1300px) {
    margin-bottom: 3rem;
  }
}
.button_style {
  width: 60vw;
  padding: 2.5rem;
  border-radius: var(--border-xxs);
  @media (max-width: 1300px) {
    padding: 1.5rem;

  }
  @media (max-width: 899px) {
    width: 100%;
    padding: 1rem;
  }
}
.badge_style {
  position: absolute;
  top: -1rem;
  right: -1rem;
  border-radius: 2.5rem;
  min-width: 4.5rem;
  width: max-content;
  height: 4.5rem;
  @media (min-width: 80rem) {
    min-width: 3rem;
    height: 3rem;
  }
}
.blocked {
  filter: brightness(0.3);
}
</style>
