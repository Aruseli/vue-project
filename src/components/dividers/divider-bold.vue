<template>
  <div class="bg-secondary full-width divider_style" v-bind="$attrs" />
</template>

<style scoped>
.divider_style {
  height: 0.3rem;
  @media (max-width: 1300px) {
    height: 0.1rem;
  }
}
</style>
