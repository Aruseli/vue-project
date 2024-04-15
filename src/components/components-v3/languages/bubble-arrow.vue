<script setup lang="ts">
const props = defineProps({
  width: {
    type: String,
    default: '42pt',
  },
  height: {
    type: String,
    default: '42pt',
  },
  fill: {
    type: String,
    default: '#ffffff',
  },
  stroke: {
    type: String,
    default: 'transparent',
  },
  strokeOpacity: {
    type: Number,
    default: 0.293734,
  },
  strokeWidth: {
    type: Number,
    default: 1,
  }
})
</script>

<template>
  <svg
    stroke-miterlimit="10"
    style="fill-rule: nonzero; clip-rule: evenodd; stroke-linecap: round; stroke-linejoin: round"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:vectornator="http://vectornator.io"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    isolation="isolate"
    viewBox="0 0 103 119"
    :width="props.width"
    :height="props.height"
    v-bind="$attrs"
  >
    <defs>
      <clipPath id="bubble-arrow">
        <rect height="119" width="103" x="0" y="0" />
      </clipPath>
    </defs>
    <g clipPath="url(#bubble-arrow)">
      <path
        d="M0.368666 118.583C0.368666 118.583 46.1949 53.0953 45.3815 0.119826C120.945 54.5578 99.9537 118.88 99.9537 118.88"
        :fill="props.fill"
        fill-rule="nonzero"
        opacity="1"
        :stroke="props.stroke"
        stroke-linecap="butt"
        stroke-linejoin="round"
        :stroke-opacity="props.strokeOpacity"
        :stroke-width="props.strokeWidth"
      />
    </g>
  </svg>
</template>
