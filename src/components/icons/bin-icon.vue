<script setup>

const props = defineProps({
  quantity: {
    type: Number,
    default: 0
  }
})

</script>

<template>
  <div class="relative-position bin_icon_style">
    <svg viewBox="0 0 122 106" height="100%" width="100%">
    <defs/>

      <g opacity="1">
        <path v-show="props.quantity" d="M23.2899 99.4944C49.461 103 73.5796 103 97.2395 99.4944C102.698 74.689 108.441 46.9768 108.441 46.9768C105.441 53.2274 94.0429 62.2554 64.2143 50.7154C34.3857 39.1754 19.7312 46.7492 14.5884 53C14.5884 53 19.6068 79.6892 23.2899 99.4944Z" fill="#0eb60b" fill-rule="nonzero" opacity="1" stroke="none"/>
        <path d="M112.556 40.5L102.982 86.9225C101.801 92.6494 101.211 95.5131 99.6693 97.655C98.3095 99.5438 96.438 101.031 94.2617 101.954C91.7935 103 88.7826 103 82.7603 103L39.2395 103C33.2174 103 30.2063 103 27.7382 101.954C25.5618 101.031 23.6905 99.5438 22.331 97.655C20.7893 95.5131 20.1988 92.6494 19.0177 86.9225L14.4886 64.9601L9.44444 40.5M112.556 40.5L99.6667 40.5M112.556 40.5L119 40.5M9.44444 40.5L3 40.5M9.44444 40.5L22.3333 40.5M99.6667 40.5L22.3333 40.5M99.6667 40.5L80.3333 3M22.3333 40.5L41.6667 3M41.6667 59.25L41.6667 78M61 59.25L61 78M80.3333 59.25L80.3333 78" fill="none" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" />
      </g>
    </svg>

  </div>
</template>

<style scoped>
.bin_icon_style {
  width: 5rem !important;
  @media (max-width: 1500px) {
    width: 2.5rem !important;
  }
  @media (max-width: 700px) {
    width: 1.5rem !important;
  }
}
</style>
