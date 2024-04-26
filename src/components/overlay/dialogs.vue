<script setup lang="ts">
import { computed } from "vue";

import { dialogs } from "src/services/dialogs";
import ModalButton from "../components-v3/buttons/modal-button.vue";

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
          class="dialog_style bg-white overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div class="text-h3 text-center pa-60 text_container first-letter">
            {{ dialog.text }}
          </div>
          <div class="buttons_container px-30 mb-30">
            <template v-for="button in dialog.buttons">
              <ModalButton v-if="button.type == 'common'"
                :name="$t(button.name)"
                color="black"
                @click="button.handler"
                textColor="white"
              />
              <ModalButton v-if="button.type == 'primary'"
                :name="$t(button.name)"
                textColor="black"
                color="green"
                @click="button.handler"
              />
              <ModalButton v-if="button.type == 'equal'"
                :name="$t(button.name)"
                textColor="green"
                color="black"
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
  background-color: rgba(24, 24, 24, .30);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(7px);
}

.dialog_style {
  border-radius: var(--border-xxs);
  position: absolute;
  z-index: 9999;
  width: 100%;
  max-width: 45rem;
  min-width: auto;
  min-height: 22rem;
  display: grid;
  grid-template-rows: 1fr max-content;
  align-items: center;
}

.text_container {
  white-space: pre-wrap;
  word-wrap: break-word;
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
.buttons_container {
  display: grid;
  align-content: center;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 20rem));
  column-gap: var(--px30);
}
</style>
