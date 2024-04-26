<script setup lang="ts">
import { computed } from "vue";

import RectangularButton from '../buttons/rectangular-button.vue';

import { dialogs } from "src/services/dialogs";

const dialog = computed(() => dialogs[0]);

const clickBackground = async () => {
  if (!dialog.value.bgClickButton) {
    return;
  }
  const button = dialog.value.buttons[dialog.value.bgClickButton];
  if (!button) {
    return;
  }
  await button.handler();
}

</script>

<template>
  <div style="height: 100vh; width: 100vw; position: absolute; top: 0; left: 0;" v-if="dialog">
    <transition name="teleport-modal-animation">
      <div class="flex items-center justify-center window-width full-height">
        <div
          class="dialog_style bg-white overflow-hidden q-pa-md-xl q-pa-xs-md"
          role="dialog"
          aria-modal="true"
        >
          <div class="text-h3 q-mb-md-md q-mb-xs-sm text-center title_style">
            {{ dialog.text }}
          </div>
          <div class="row justify-evenly items-center">
            <template v-for="button in dialog.buttons">
              <RectangularButton v-if="button.type != 'primary'"
                :name="button.name"
                color="transparent"
                class="q-px-xs-sm q-py-md-sm q-py-xs-xs col-3"
                @click="button.handler"
                textColor="primary"
              />
              <RectangularButton v-if="button.type == 'primary'"
                :name="button.name"
                class="q-px-md-sm q-px-xs-sm q-py-md-sm q-py-xs-xs col-3"
                @click="button.handler"
              />
            </template>
          </div>
        </div>
        <div class="modal_bg" @click="clickBackground">
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal_bg {
  z-index: 9998;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .65);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog_style {
  border-radius: 2rem;
  position: absolute;
  z-index: 9999;
}

.teleport-modal-animation-enter-active,
.teleport-modal-animation-leave-active {
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.teleport-modal-animation-leave-to,
.teleport-modal-animation-enter-from {
  opacity: 0;
  transform: scale(1.1);
}

</style>
