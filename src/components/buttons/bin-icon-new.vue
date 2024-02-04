<script setup>

</script>

<template>
  <div class="relative-position">
    <svg height="100" width="100" stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 122 106" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:vectornator="http://vectornator.io" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs/>

      <g opacity="1" vectornator:layerName="Group 1">
        <slot></slot>
        <path d="M112.556 40.5L102.982 86.9225C101.801 92.6494 101.211 95.5131 99.6693 97.655C98.3095 99.5438 96.438 101.031 94.2617 101.954C91.7935 103 88.7826 103 82.7603 103L39.2395 103C33.2174 103 30.2063 103 27.7382 101.954C25.5618 101.031 23.6905 99.5438 22.331 97.655C20.7893 95.5131 20.1988 92.6494 19.0177 86.9225L14.4886 64.9601L9.44444 40.5M112.556 40.5L99.6667 40.5M112.556 40.5L119 40.5M9.44444 40.5L3 40.5M9.44444 40.5L22.3333 40.5M99.6667 40.5L22.3333 40.5M99.6667 40.5L80.3333 3M22.3333 40.5L41.6667 3M41.6667 59.25L41.6667 78M61 59.25L61 78M80.3333 59.25L80.3333 78" fill="none" opacity="1" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" vectornator:layerName="path"/>
      </g>
    </svg>

  </div>
</template>

<style scoped>
.bin {
  z-index: 2;
}
.bg {
  position: absolute;
  bottom: 14px; left: 0;
  z-index: 1;
}
</style>
