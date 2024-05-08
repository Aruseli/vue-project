<script setup lang="ts">
import { useAppStore } from 'src/stores/app';

const app = useAppStore();
const props = defineProps({
  fill: {
    type: String,
    default: '#88D863'
  },
  width: {
    type: String,
    default: "100%"
  },
  height: {
    type: String,
    default: "100%"
  }
})
</script>

<template>
  <svg :width="props.width" :height="props.height" viewBox="0 0 61 70" fill="none" xmlns="http://www.w3.org/2000/svg" :class="[app.lang_dir == 'rtl' ? 'direction' : '']">
    <g clip-path="url(#clip0_192_8065)">
    <path d="M30.3115 70L0 52.5009V17.4991L30.3115 0L60.623 17.4991V52.4991L30.3115 69.9982V70ZM3.779 50.3185L30.3115 65.637L56.844 50.3185V19.6815L30.3115 4.36302L3.779 19.6815V50.3185Z" :fill="props.fill"/>
    <path d="M24.0464 31.398V42.5776L10.6138 35.1932V23.9918L5.48047 21.0283V49.5552L10.6138 52.5187V41.0498L24.0464 48.4342V59.9248L29.1796 62.8884V34.3615L24.0464 31.398Z" :fill="props.fill"/>
    <path d="M55.2204 31.6515V23.2165V20.7593L36.5478 31.4887V31.4761L31.4652 34.4089L31.4146 34.4378V34.4396V62.9665L34.2587 61.3247L55.2204 49.3042V48.2646V39.8278L50.0871 42.5726V46.3697L36.5478 54.1012V37.4104L50.0871 29.6336V34.3962L55.2204 31.6515Z" :fill="props.fill"/>
    <path d="M34.7105 19.5618L43.8614 14.0163L38.7788 11.1323L29.579 16.5983L21.3068 11.823L16.1609 14.7775L24.4457 19.5618L15.311 24.6987L20.5691 27.5881L29.579 22.5254L39.0916 27.8593L44.2357 24.9031L34.7105 19.5618Z" :fill="props.fill"/>
    </g>
    <defs>
    <clipPath id="clip0_192_8065">
    <rect width="61" height="70" fill="white"/>
    </clipPath>
    </defs>
  </svg>
</template>

<style scoped>
.direction {
  transform: rotateY(180deg);
}
</style>
