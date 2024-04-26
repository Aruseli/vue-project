<script setup lang="ts">
import {useQuasar} from 'quasar';
const $q = useQuasar();

const showTouchAlert = () => {
 alert('I am a touched');
};
const showClickAlert = () => {
 alert('I am clicked');
};
</script>

<template>
  <div class="container row">
    <div class="buttons pa-40">
      <q-btn flat round @touchend="showTouchAlert" class="mr-40">
        <q-icon name="touch_app" color="white" size="2.5rem" />
      </q-btn>
      <q-btn flat round @click="showClickAlert" class="mr-40">
        <q-icon name="mouse" color="white" size="2.5rem" />
      </q-btn>
    </div>
    <div class="scroll_area">
      <div class="scrolled_block px-40">
        <p>scroll</p>
        <p class="absolute-bottom px-40">you're a damn hero</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 200px;
  background-color: grey;
}

.buttons {
  width: max-content
}
.scroll_area {
  overflow-y: scroll;
  width: max-content;
  height: 100%;
}
.scrolled_block {
  position: relative;
  height: 500px;
  width: 10rem;
  background-color: aqua;
}
p {margin: 0}
.icons {
  font-size: 4rem;
}
</style>
