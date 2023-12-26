<script setup>

</script>

<template>
  <div class='r-hex'>
    <div class="r-hex-inner">
      <!-- <q-icon >
        <BinIcon />
      </q-icon> -->
      111
    </div>
  </div>
</template>


<style scoped>
.r-hex {
  overflow: hidden;
  display: inline-block;
  margin: 2em 0;
  width: 6.05em; height: 5.35em;
  transform: rotate(-30deg) skewX(30deg);
  border-radius: .3em;
}
.r-hex > *, .r-hex > *:before {
  display: block;
  overflow: hidden;
  width: inherit; height: inherit;
  border-radius: inherit;
}
.r-hex-inner {
  transform: skewX(-30deg) rotate(60deg) skewX(30deg);
  /* opacity: .15;
  transition: opacity .75s; */
  opacity: 1;
  /* transition: opacity .75s; */
  cursor: pointer;
  background: var(--q-primary);
}
.r-hex:first-child .r-hex-inner:before {
  transform: skewX(-30deg) rotate(60deg) skewX(30deg);
  background: var(--q-primary);
  content: '';
}
/* .r-hex-inner:hover { opacity: 1; } */
</style>
