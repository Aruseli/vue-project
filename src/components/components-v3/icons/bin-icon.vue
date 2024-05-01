<script setup lang="ts">
const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  }
})
</script>

<template>
  <div class="relative-position">
    <svg :width="props.width" :height="props.height" viewBox="0 0 52 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 21L13 33" stroke="#FAFAFA" stroke-width="4" stroke-linecap="round"/>
      <path d="M26 21L26 33" stroke="#FAFAFA" stroke-width="4" stroke-linecap="round"/>
      <path d="M38 21L38 33" stroke="#FAFAFA" stroke-width="4" stroke-linecap="round"/>
      <path d="M38.9095 9.66459C38.9857 10.7818 38.9978 12.1583 38.9996 14L13.0004 14C13.0022 12.1583 13.0143 10.7818 13.0905 9.66459C13.1787 8.37185 13.3461 7.57307 13.609 6.93853C14.4209 4.97831 15.9783 3.42092 17.9385 2.60897C18.5731 2.34613 19.3718 2.17872 20.6646 2.09051C21.9753 2.00109 23.6429 2 26 2C28.3571 2 30.0247 2.00108 31.3354 2.09051C32.6281 2.17871 33.4269 2.34613 34.0615 2.60896C36.0217 3.42092 37.5791 4.97831 38.391 6.93853C38.6539 7.57307 38.8213 8.37185 38.9095 9.66459Z" stroke="#FAFAFA" stroke-width="4"/>
      <mask id="path-5-inside-1_249_6719" fill="white">
      <path d="M1 18C1 15.1716 1 13.7574 1.87868 12.8787C2.75736 12 4.17157 12 7 12H45C47.8284 12 49.2426 12 50.1213 12.8787C51 13.7574 51 15.1716 51 18C51 29.3137 51 34.9706 47.4853 38.4853C43.9706 42 38.3137 42 27 42H25C13.6863 42 8.02944 42 4.51472 38.4853C1 34.9706 1 29.3137 1 18Z"/>
      </mask>
      <path d="M1 18C1 15.1716 1 13.7574 1.87868 12.8787C2.75736 12 4.17157 12 7 12H45C47.8284 12 49.2426 12 50.1213 12.8787C51 13.7574 51 15.1716 51 18C51 29.3137 51 34.9706 47.4853 38.4853C43.9706 42 38.3137 42 27 42H25C13.6863 42 8.02944 42 4.51472 38.4853C1 34.9706 1 29.3137 1 18Z" stroke="#FAFAFA" stroke-width="8" mask="url(#path-5-inside-1_249_6719)"/>
    </svg>
  </div>
</template>
