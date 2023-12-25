<script setup>
  import { onMounted } from 'vue';
  import ProductCard from '../components/product-card.vue';
  import { useProductsStore } from '../stores/product-store';

  const productsStore = useProductsStore();

  // const store = productsStore();

  onMounted(() => {
    productsStore.getProducts();
  })

</script>

<template>
  <q-tab-panels v-model="productsStore.tab" animated swipeable class="fit">
    <q-tab-panel name="food" dark>
      <div class="image_grid">
        <q-intersection
          v-for="(product, index) in productsStore.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection_card_settings"
          style="width: max-content; height: 845px"
        >
          <ProductCard :product="productsStore.products[index]" />
        </q-intersection>
      </div>
    </q-tab-panel>

    <q-tab-panel name="roll_sets" dark>
      <div class="image_grid">
        <q-intersection
          v-for="(product, index) in productsStore.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection_card_settings"
          style="width: max-content; height: 845px"
        >
          <ProductCard :product="productsStore.products[index]" />
        </q-intersection>
      </div>
    </q-tab-panel>

    <q-tab-panel name="weight_sets">
      <div class="image_grid">
        <q-intersection
          v-for="(product, index) in productsStore.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection_card_settings"
          style="width: max-content; height: 845px"
        >
          <ProductCard :product="productsStore.products[index]" />
        </q-intersection>
      </div>
    </q-tab-panel>

    <q-tab-panel name="consumption_sets">
      <div class="image_grid">
        <q-intersection
          v-for="(product, index) in productsStore.products"
          :key="index"
          transition="slide-up"
          :threshold="0"
          transition-duration="0.5"
          ssr-prerender
          class="intersection_card_settings"
          style="width: max-content; height: 845px"
        >
          <ProductCard :product="productsStore.products[index]" />
        </q-intersection>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>

<style lang="scss" scoped>
  $calc_width: calc(var(--width_coefficient) + var(--coefficient));
  $calc_gap: calc(1rem + var(--coefficient_gap));

.image_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, $calc_width);
  gap: $calc_gap;
  width: 100%;
  height: 100%;
  padding: 0 3.75rem;
  justify-content: center;
  margin-top: 2rem;
}
.intersection_card_settings{
  min-height: 46rem;
}
</style>
